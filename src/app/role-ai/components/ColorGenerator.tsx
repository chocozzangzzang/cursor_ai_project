'use client';

import { useState } from 'react';
import { Send, ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface ColorResult {
  name: string;
  css_code: string;
  description: string;
}

export default function ColorGenerator() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ColorResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
          role: 'color',
          prompt: input,
          systemMessage: `You will be provided with a description of a mood or theme, and your task is to generate three different colors that match it. 
Write your output in json with an array of objects, each containing:
- "name" (한글로 색상 이름)
- "css_code" (CSS color code)
- "description" (한글로 색상에 대한 간단한 설명, 20자 이내)
Example output: {
  "colors": [
    {"name": "따뜻한 오렌지", "css_code": "#FF7F50", "description": "활기찬 에너지를 주는 밝은 색조"},
    {"name": "부드러운 살구", "css_code": "#FFDAB9", "description": "포근하고 달콤한 파스텔 톤"},
    {"name": "진한 코랄", "css_code": "#FF6B6B", "description": "생동감 있는 따뜻한 핑크"}
  ]
}`,
        }),
      });

      if (!response.ok) throw new Error('응답을 받아올 수 없습니다.');

      const data = await response.json();
      try {
        const colorData = JSON.parse(data.message);
        setResults(colorData.colors);
      } catch (e) {
        console.error('색상 데이터 파싱 오류:', e);
        alert('색상 데이터 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
              <h2 className="text-2xl font-semibold">컬러 생성기</h2>
              <span className="text-2xl">🎨</span>
            </div>
            <p className="text-gray-400">텍스트를 기반으로 3가지 색상을 생성합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="mb-6 flex-1">
            <div className="flex gap-[15px] h-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="원하는 분위기나 테마를 설명해주세요..."
                className="flex-1 p-4 rounded-2xl glass-effect focus:ring-2 focus:ring-indigo-400 focus:outline-none h-[120px] text-base text-white placeholder:text-gray-500"
                disabled={isLoading}
                style={{ color: 'white' }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-4 rounded-2xl glass-effect disabled:opacity-50 disabled:cursor-not-allowed h-[120px] w-[60px] flex items-center justify-center"
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
          ) : results.length > 0 && (
            <div className="flex gap-[15px] mt-auto h-[200px]">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex-1 glass-effect rounded-2xl overflow-hidden flex flex-col"
                >
                  <div
                    className="h-[80px]"
                    style={{ backgroundColor: result.css_code }}
                  />
                  <div className="p-[15px] flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-1">{result.name}</h3>
                      <p className="text-xs text-gray-400">{result.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-white font-mono">{result.css_code}</span>
                      <button
                        onClick={() => handleCopy(index, result.css_code)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 bg-black/20 px-2 py-1 rounded-lg"
                        title="색상 코드 복사"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>복사</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 