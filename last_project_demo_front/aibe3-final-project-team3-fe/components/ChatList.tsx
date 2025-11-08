'use client';

import React from 'react';
import { ChatRoom } from '../lib/mockData';

interface ChatListProps {
  chatRooms: ChatRoom[];
  activeChatRoomId: number | null;
  onRoomSelect: (roomId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chatRooms, activeChatRoomId, onRoomSelect }) => {
  return (
    <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold p-4 border-b border-gray-200">대화 목록</h2>
        <ul className="overflow-y-auto flex-grow">
        {chatRooms.map(room => (
            <li key={room.id}>
            <button
                onClick={() => onRoomSelect(room.id)}
                className={`w-full text-left p-4 transition-colors ${
                activeChatRoomId === room.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
            >
                <p className="font-semibold">{room.name}</p>
                {/* Can add last message preview here */}
            </button>
            </li>
        ))}
        </ul>
    </div>
  );
};

export default ChatList;
