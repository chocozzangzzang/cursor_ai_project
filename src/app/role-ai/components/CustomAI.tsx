'use client';

import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CustomAI() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [customSystemMessage, setCustomSystemMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !customSystemMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/role-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'custom',
          prompt: input,
          systemMessage: customSystemMessage,
        }),
      });

      if (!response.ok) throw new Error('응답을 받아올 수 없습니다.');

      const data = await response.json();
      setResult(data.message);
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
      <div className="container mx-auto max-w-[70%] p-4 flex flex-col mt-[30px]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-full">
            <Link href="/role-ai" className="flex items-center text-gray-400 hover:text-gray-200 transition-colors">
              <ArrowLeft className="w-6 h-6 mr-2" />
              <span>돌아가기</span>
            </Link>
          </div>
        </div>

        <div className="glass-effect px-[15px] py-[20px] rounded-[20px] min-h-[300px] flex flex-col mt-[30px]">
          <div className="mb-6">
            <div className="flex items-center gap-[15px] mb-2">
              <h2 className="text-2xl font-semibold">커스텀 AI</h2>
              <span className="text-2xl">🤖</span>
            </div>
            <p className="text-gray-400">나만의 AI 역할을 만듭니다</p>
          </div>

          <div className="mb-[15px] w-full max-w-full">
                          <textarea
              value={customSystemMessage}
              onChange={(e) => setCustomSystemMessage(e.target.value)}
              placeholder="AI의 역할을 설명해주세요..."
              className="w-full px-[15px] py-[15px] rounded-2xl glass-effect focus:ring-2 focus:ring-indigo-400 focus:outline-none h-[150px] text-white placeholder:text-gray-500 box-border resize-none"
              style={{ color: 'white' }}
            />
          </div>

          <form onSubmit={handleSubmit} className="mb-[15px] w-full">
            <div className="flex gap-[20px] w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 p-[15px] rounded-2xl glass-effect focus:ring-2 focus:ring-indigo-400 focus:outline-none h-[60px] text-white placeholder:text-gray-500 min-w-0 box-border"
                style={{ color: 'white' }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-[15px] rounded-2xl glass-effect hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[60px] w-[60px] flex-shrink-0 flex items-center justify-center"
                style={{ color: 'white' }}
              >
                <Send className="w-6 h-6 text-white" style={{ color: 'white' }} />
              </button>
            </div>
          </form>

          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 my-4">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : result && (
            <div className="p-[15px] glass-effect rounded-2xl min-h-[150px] text-white overflow-auto">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 