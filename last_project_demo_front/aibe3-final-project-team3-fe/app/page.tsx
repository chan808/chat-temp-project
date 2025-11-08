'use client';

import React, { useState, useEffect } from 'react';
import { users, chatRooms, messages as initialMessages, ChatMessage } from '../lib/mockData';

import UserSwitcher from '../components/UserSwitcher';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<number>(1);
  const [activeChatRoomId, setActiveChatRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const currentUser = users.find(u => u.id === currentUserId);
  // Find chat rooms for the current user and enrich them with the other participant's name
  const userChatRooms = chatRooms
    .filter(room => room.participants.includes(currentUserId))
    .map(room => {
        const otherParticipantId = room.participants.find(p => p !== currentUserId);
        const otherUser = users.find(u => u.id === otherParticipantId);
        return {
            ...room,
            name: otherUser ? otherUser.name : 'Unknown User' // Fallback name
        }
    });

  useEffect(() => {
    // When user switches, select the first chat room by default if available
    if (userChatRooms.length > 0 && !activeChatRoomId) {
      setActiveChatRoomId(userChatRooms[0].id);
    } else if (userChatRooms.length === 0) {
      setActiveChatRoomId(null);
    }
  }, [currentUserId, userChatRooms, activeChatRoomId]);

  const handleSendMessage = (text: string) => {
    if (!activeChatRoomId || !currentUser) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      roomId: activeChatRoomId,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 font-sans">
      <UserSwitcher users={users} currentUserId={currentUserId} onUserChange={setCurrentUserId} />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
          <ChatList chatRooms={userChatRooms} activeChatRoomId={activeChatRoomId} onRoomSelect={setActiveChatRoomId} />
        </div>
        <div className="w-3/4 flex flex-col bg-gray-50">
          <div className="flex-grow p-4 overflow-y-auto">
            <ChatWindow messages={messages.filter(m => m.roomId === activeChatRoomId)} currentUserId={currentUserId} />
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
