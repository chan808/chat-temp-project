'use client';

import React, { useEffect, useRef } from 'react';
import { ApiMessage } from '../lib/api';

interface ChatWindowProps {
  messages: ApiMessage[];
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
              {message.messageType === 'TEXT' && (
                <p className="text-sm">{message.content}</p>
              )}
              {message.messageType === 'IMAGE' && (
                <img src={message.content} alt="Uploaded Image" className="max-w-full h-auto rounded-lg" />
              )}
              {message.messageType === 'FILE' && (
                <a href={message.content} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                  파일 다운로드: {message.content.substring(message.content.lastIndexOf('/') + 1)}
                </a>
              )}
              {message.createdAt && (
                <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Intl.DateTimeFormat('ko-KR', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  }).format(new Date(String(message.createdAt).replace(' ', 'T')))}
                </p>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
