'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { StompSubscription } from '@stomp/stompjs';
import { jwtDecode } from 'jwt-decode';

import Login from '../components/Login';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';

import * as api from '../lib/api';
import * as socket from '../lib/socket';

interface DecodedToken {
    sub: string;
    memberId: number;
    // add other fields from the token if needed
}

export default function Home() {
    // State management
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jwt, setJwt] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);

    const [rooms, setRooms] = useState<api.ApiChatRoom[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
    const [messages, setMessages] = useState<api.ApiMessage[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<StompSubscription | null>(null);

    // Check for token in localStorage on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('jwt');
        if (storedToken) {
            setJwt(storedToken);
            const decodedToken = jwtDecode<DecodedToken>(storedToken);
            setCurrentUser(decodedToken);
            setIsAuthenticated(true);
        }
    }, []);

    // Effect for establishing and maintaining WebSocket connection
    useEffect(() => {
        if (isAuthenticated && jwt) {
            api.getRooms(jwt)
                .then(fetchedRooms => {
                    setRooms(fetchedRooms);
                    if (fetchedRooms.length > 0 && !activeRoomId) {
                        setActiveRoomId(fetchedRooms[0].id);
                    }
                })
                .catch(err => console.error("Failed to fetch rooms:", err));

            socket.connect(jwt, () => {
                console.log("WebSocket connection established and authenticated.");
                // Subscribe to user-specific topics, like new room notifications
                if (currentUser?.memberId) {
                    socket.subscribeToNewRooms(currentUser.memberId, (newRoom) => {
                        console.log("New room received:", newRoom);
                        setRooms(prevRooms => {
                            // Prevent adding duplicate rooms
                            if (prevRooms.some(room => room.id === newRoom.id)) {
                                return prevRooms;
                            }
                            return [...prevRooms, newRoom];
                        });
                    });
                }
            });
        }

        return () => {
            if (socket.getStompClient()?.connected) {
                socket.disconnect();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, jwt]);

    // Effect for handling room changes (subscribing to messages)
    useEffect(() => {
        if (activeRoomId && jwt && socket.getStompClient()?.connected) {
            // Clear previous messages immediately on room change
            setMessages([]);

            if (currentSubscription) {
                currentSubscription.unsubscribe();
            }

            api.getMessages(activeRoomId, jwt)
                .then(setMessages)
                .catch(err => console.error("Failed to fetch messages:", err));

            const subscription = socket.subscribeToRoom(activeRoomId, (newMessage) => {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
            setCurrentSubscription(subscription);
        }

        return () => {
            currentSubscription?.unsubscribe();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRoomId, jwt]);

    const handleLogin = async (email: string, password: string) => {
        try {
            const receivedJwt = await api.login(email, password);
            localStorage.setItem('jwt', receivedJwt);
            setJwt(receivedJwt);
            const decodedToken = jwtDecode<DecodedToken>(receivedJwt);
            setCurrentUser(decodedToken);
            setIsAuthenticated(true);
            setLoginError(null);
        } catch (error: any) { 
            setLoginError(error.message || 'An unknown error occurred.');
        }
    };

    const handleSendMessage = (content: string) => {
        if (activeRoomId && socket.getStompClient()?.connected) {
            socket.sendMessage(activeRoomId, content);
        }
    };

    const handleSendFile = async (file: File, messageType: 'IMAGE' | 'FILE') => {
        if (!activeRoomId || !jwt) {
            console.error("채팅방이 활성화되지 않았거나 JWT가 없습니다.");
            return;
        }
        try {
            // 파일 업로드 API 호출
            const uploadedMessage = await api.uploadFile(activeRoomId, file, messageType, jwt);
            // 업로드된 메시지를 UI에 즉시 반영 (WebSocket을 통해 다시 받을 수도 있지만, 즉시 반영하여 UX 개선)
            setMessages(prevMessages => [...prevMessages, uploadedMessage]);
        } catch (error) {
            console.error("파일 업로드 실패:", error);
            alert(`파일 업로드 실패: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleCreateRoom = async (partnerId: number) => {
        if (jwt) {
            try {
                const newRoom = await api.createDirectRoom(jwt, partnerId);
                setRooms(prevRooms => {
                    // Check if room already exists to prevent duplicates
                    if (prevRooms.some(room => room.id === newRoom.id)) {
                        return prevRooms;
                    }
                    return [...prevRooms, newRoom];
                });
                setActiveRoomId(newRoom.id);
            } catch (error) {
                console.error("Failed to create direct room:", error);
            }
        }
    };

    // Render Login or Chat UI
    if (!isAuthenticated || !currentUser) {
        return <Login onLogin={handleLogin} error={loginError} />;
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-100 font-sans">
            <div className="flex flex-grow overflow-hidden">
                <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
                    <ChatList 
                        chatRooms={rooms} 
                        activeChatRoomId={activeRoomId} 
                        onRoomSelect={setActiveRoomId} 
                        currentUserId={currentUser.memberId}
                        token={jwt!}
                    />
                    <UserList token={jwt!} onCreateRoom={handleCreateRoom} />
                </div>
                <div className="w-3/4 flex flex-col bg-gray-50">
                    <div className="flex-grow p-4 overflow-y-auto">
                        <ChatWindow 
                            messages={messages} 
                            currentUserId={currentUser.memberId}
                        />
                    </div>
                    <div className="p-4 bg-white border-t border-gray-200">
                        <MessageInput onSendMessage={handleSendMessage} onSendFile={handleSendFile} />
                    </div>
                </div>
            </div>
        </div>
    );
}
