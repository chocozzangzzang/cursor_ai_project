'use client';

import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      if (!response.ok) throw new Error('응답을 받아올 수 없습니다.');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 to-purple-900/20 flex items-center justify-center">
      <div className="container mx-auto max-w-[70%] h-[80vh] p-4 flex flex-col">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-400 hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span>돌아가기</span>
          </Link>
          <h1 className="text-3xl font-bold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            AI 챗봇
          </h1>
        </div>
        
        <div className="flex-1 overflow-auto chat-container p-6 mb-[30px]">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              AI 챗봇과 대화를 시작해보세요!
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`message-bubble ${
                  message.role === 'user' ? 'user-message' : 'assistant-message'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2 my-4">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-stretch gap-[15px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-[10px] rounded-2xl border-0 glass-effect focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200 placeholder-gray-400 min-h-[60px]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="aspect-square p-[10px] rounded-2xl glass-effect hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 flex items-center justify-center min-h-[60px]"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
} 