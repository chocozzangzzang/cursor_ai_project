import Link from 'next/link'

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
    title: "구조적 응답 리더",
    description: "JSON 형식으로 응답하여 정보 UI를 생성하는 AI",
    emoji: "🔧",
    path: "/structured-response"
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
              <Link href={feature.path} key={index} className="block w-[560px]">
                <div className="glass-effect rounded-[20px] p-[20px] h-[150px] flex items-center cursor-pointer">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-[20px]">
                      <span className="text-[42px]">{feature.emoji}</span>
                      <h2 className="text-base font-medium">
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
