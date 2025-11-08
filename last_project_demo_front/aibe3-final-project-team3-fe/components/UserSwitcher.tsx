'use client';

import React from 'react';
import { User } from '../lib/mockData';

interface UserSwitcherProps {
  users: User[];
  currentUserId: number;
  onUserChange: (userId: number) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ users, currentUserId, onUserChange }) => {
  return (
    <div className="p-2 bg-gray-800 text-white flex items-center justify-center space-x-2">
      <span className="font-bold">로그인된 사용자:</span>
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => onUserChange(user.id)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currentUserId === user.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          {user.name}
        </button>
      ))}
    </div>
  );
};

export default UserSwitcher;
