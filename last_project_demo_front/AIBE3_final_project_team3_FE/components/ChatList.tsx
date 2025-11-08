'use client';

import React, { useState } from 'react';
import { ApiChatRoom, createPublicRoom } from '../lib/api';

interface ChatListProps {
  chatRooms: ApiChatRoom[];
  activeChatRoomId: number | null;
  onRoomSelect: (roomId: number) => void;
  currentUserId: number;
  token: string; // Added token prop
}

const ChatList: React.FC<ChatListProps> = ({ chatRooms, activeChatRoomId, onRoomSelect, currentUserId, token }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getRoomName = (room: ApiChatRoom) => {
    if (room.roomType === 'DIRECT') {
      const otherMember = room.members.find(member => member.id !== currentUserId);
      return otherMember ? otherMember.nickname : room.name;
    }
    return room.name;
  };

  const handleCreate = async () => {
    if (!newRoomName.trim() || !token) {
      setError("채팅방 이름을 입력해주세요.");
      return;
    }
    try {
      setError(null);
      await createPublicRoom(token, newRoomName);
      // The WebSocket connection should handle adding the room to the list
      setIsCreating(false);
      setNewRoomName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">대화 목록</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="text-blue-500 hover:text-blue-700 font-bold text-2xl"
        >
          +
        </button>
      </div>

      {isCreating && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="그룹 채팅방 이름"
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => {
                setIsCreating(false);
                setError(null);
                setNewRoomName("");
              }}
              className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
            >
              취소
            </button>
            <button 
              onClick={handleCreate}
              className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              생성
            </button>
          </div>
        </div>
      )}

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
              <p className="font-semibold">{getRoomName(room)}</p>
              {/* Can add last message preview here */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
