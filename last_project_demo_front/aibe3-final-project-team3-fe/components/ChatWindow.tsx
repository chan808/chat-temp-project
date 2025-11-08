'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../lib/mockData';

interface ChatWindowProps {
  messages: ChatMessage[];
  currentUserId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">대화를 시작해보세요.</div>;
  }

  return (
    <div className="flex-grow p-4 space-y-4">
      {messages.map(message => {
        const isCurrentUser = message.senderId === currentUserId;
        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
