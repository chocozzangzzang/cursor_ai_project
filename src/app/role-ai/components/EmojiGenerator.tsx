'use client';

import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmojiGenerator() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/role-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'emoji',
          prompt: input,
          systemMessage: 'You will be provided with text, and your task is to translate it into emojis. Do not use any regular text. Do your best with emojis only.',
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

        <div className="glass-effect p-[20px] rounded-[20px] h-[450px] flex flex-col mt-[30px]">
          <div className="mb-6">
            <div className="flex items-center gap-[15px] mb-2">
              <h2 className="text-2xl font-semibold">이모지 생성기</h2>
              <span className="text-2xl">😊</span>
            </div>
            <p className="text-gray-400">텍스트를 이모지로 변환합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="mb-6 flex-1">
            <div className="flex gap-[15px] h-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="이모지로 변환할 텍스트를 입력하세요..."
                className="flex-1 p-4 rounded-2xl glass-effect focus:ring-2 focus:ring-indigo-400 focus:outline-none h-[180px] text-base text-white placeholder:text-gray-500"
                disabled={isLoading}
                style={{ color: 'white' }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-4 rounded-2xl glass-effect disabled:opacity-50 disabled:cursor-not-allowed h-[180px] w-[60px] flex items-center justify-center"
              >
                <Send className="w-6 h-6" />
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
            <div className="text-4xl text-center p-6 glass-effect rounded-2xl mt-auto h-[180px] flex items-center justify-center">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 