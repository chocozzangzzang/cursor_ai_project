'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RoleFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

const roleFeatures: RoleFeature[] = [
  {
    id: 'emoji',
    title: '이모지 생성기',
    description: '텍스트를 이모지로 변환합니다',
    icon: '😊',
    path: '/role-ai/emoji'
  },
  {
    id: 'color',
    title: '컬러 생성기',
    description: '텍스트를 기반으로 색상을 생성합니다',
    icon: '🎨',
    path: '/role-ai/color'
  },
  {
    id: 'translate',
    title: '번역기',
    description: '한국어를 다른 언어로 번역합니다',
    icon: '🌐',
    path: '/role-ai/translate'
  },
  {
    id: 'custom',
    title: '커스텀 AI',
    description: '나만의 AI 역할을 만듭니다',
    icon: '🤖',
    path: '/role-ai/custom'
  }
];

export default function RoleAIPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
      <div className="container mx-auto max-w-[70%] p-4 flex flex-col mt-[30px]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-full">
            <Link href="/" className="flex items-center text-gray-400 hover:text-gray-200 transition-colors">
              <ArrowLeft className="w-6 h-6 mr-2" />
              <span>돌아가기</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">
            역할 기반 AI
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-[15px] w-[1200px] mx-auto mt-0">
          {roleFeatures.map((role) => (
            <div
              key={role.id}
              className="w-[560px] rounded-[20px] overflow-hidden bg-transparent"
            >
              <button
                onClick={() => router.push(role.path)}
                className="glass-effect w-full p-[20px] h-[150px] flex items-center cursor-pointer text-white"
                style={{ color: 'white' }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-[20px]">
                    <span className="text-[42px]">{role.icon}</span>
                    <h2 className="text-base font-medium" style={{ color: 'white', background: 'none' }}>
                      {role.title}
                    </h2>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'white' }}>
                    {role.description}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 