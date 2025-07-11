import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface FeatureCard {
  title: string;
  description: string;
  emoji: string;
  path: string;
}

const features: FeatureCard[] = [
  {
    title: "기본 챗봇",
    description: "사용자의 질문에 답변하는 AI 챗봇",
    emoji: "💬",
    path: "/chatbot"
  },
  {
    title: "역할 AI",
    description: "특별한 역할을 수행하는 전문가 AI",
    emoji: "🤖",
    path: "/role-ai"
  },
  {
    title: "블로그 생성기",
    description: "주제에 맞는 블로그 글을 작성하는 AI",
    emoji: "📝",
    path: "/blog-writer"
  },
  {
    title: "Cursor 퀴즈",
    description: "Cursor AI에 대한 지식을 테스트하는 퀴즈",
    emoji: "🧠",
    path: "/quiz"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen p-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-2 text-purple-400">
            Open Talk AI
          </h1>
          <p className="text-gray-400 text-sm">
            인공지능과 함께하는 새로운 대화의 시작
          </p>
        </div>

        <div className="w-[1200px] mx-auto">
          <div className="grid grid-cols-2 gap-[15px]">
            {features.map((feature, index) => (
              <div key={index} className="relative group w-[560px]">
                <Link href={feature.path} className="block">
                  <div className="glass-effect rounded-[20px] p-[20px] h-[150px] flex flex-col justify-between cursor-pointer">
                    <div className="flex items-start gap-[20px]">
                      <span className="text-[42px]">{feature.emoji}</span>
                      <div>
                        <h2 className="text-base font-medium mb-1">
                          {feature.title}
                        </h2>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="self-end text-purple-400 flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 mt-2">
                      <span className="text-xs font-medium">바로가기</span>
                      <ArrowRight className="size-3" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
