'use client';

import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Translator() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('영어');

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
          role: 'translate',
          prompt: input,
          systemMessage: `You will be provided with a sentence in Korean, and your task is to translate it into ${selectedLanguage}. Only respond with the translation, no explanations.`,
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
          <div className="mb-[15px]">
            <div className="flex items-center gap-[15px] mb-2">
              <h2 className="text-2xl font-semibold">번역기</h2>
              <span className="text-2xl">🌐</span>
            </div>
            <p className="text-gray-400">한국어를 다른 언어로 번역합니다</p>
          </div>

          <div className="mb-[15px]">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-4 rounded-2xl glass-effect focus:ring-2 focus:ring-indigo-400 focus:outline-none h-[96px] text-base text-white"
              style={{ color: 'white' }}
            >
              <option value="영어" className="text-white bg-[#16181d]">영어</option>
              <option value="일본어" className="text-white bg-[#16181d]">일본어</option>
              <option value="중국어" className="text-white bg-[#16181d]">중국어</option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="mb-[15px]">
            <div className="flex gap-[15px]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="번역할 한국어를 입력하세요..."
                className="flex-1 p-4 rounded-2xl glass-effect focus:ring-2 focus:ring-indigo-400 focus:outline-none h-[96px] text-base text-white placeholder:text-gray-500"
                disabled={isLoading}
                style={{ color: 'white' }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-4 rounded-2xl glass-effect disabled:opacity-50 disabled:cursor-not-allowed h-[96px] w-[60px] flex items-center justify-center"
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
            <div className="flex-1 p-[15px] glass-effect rounded-2xl overflow-auto">
              <p className="text-white text-base">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 