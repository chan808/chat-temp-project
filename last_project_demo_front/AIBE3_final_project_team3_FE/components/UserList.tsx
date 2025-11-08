'use client';

import React, { useState, useEffect } from 'react';
import { Member, getUsers } from '../lib/api';

interface UserListProps {
  token: string;
  onCreateRoom: (partnerId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ token, onCreateRoom }) => {
  const [users, setUsers] = useState<Member[]>([]);

  useEffect(() => {
    if (token) {
        getUsers(token)
            .then(setUsers)
            .catch(err => console.error("Failed to fetch users:", err));
    }
  }, [token]);

  return (
    <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold p-4 border-b border-gray-200">사용자 목록</h2>
        <ul className="overflow-y-auto flex-grow">
        {users.map(user => (
            <li key={user.id}>
            <button
                onClick={() => onCreateRoom(user.id)}
                className="w-full text-left p-4 transition-colors hover:bg-gray-50"
            >
                <p className="font-semibold">{user.nickname}</p>
            </button>
            </li>
        ))}
        </ul>
    </div>
  );
};

export default UserList;
