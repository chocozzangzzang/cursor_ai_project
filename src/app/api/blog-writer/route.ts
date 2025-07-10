import { NextResponse } from 'next/server';
import openai from '@/lib/openai';

interface BlogRequestData {
  topic: string;
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational' | 'conversational';
  length: number;
  keywords: string;
  audience: 'general' | 'beginners' | 'intermediate' | 'experts' | 'professionals' | 'students';
}

export async function POST(request: Request) {
  try {
    const { topic, tone, length, keywords, audience } = await request.json() as BlogRequestData;

    // 키워드 처리
    const keywordList = keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
    const keywordPrompt = keywordList.length > 0 
      ? `다음 키워드들을 자연스럽게 포함시켜주세요: ${keywordList.join(', ')}.` 
      : '';

    // 톤에 따른 스타일 설정
    const toneMap = {
      professional: '전문적이고 정보 중심적인 톤으로, 공식적인 언어를 사용하세요.',
      casual: '친근하고 대화체로, 독자와 직접 대화하는 듯한 느낌으로 작성하세요.',
      humorous: '유머러스하고 가벼운 톤으로, 재미있는 비유나 농담을 적절히 사용하세요.',
      inspirational: '동기부여적이고 영감을 주는 톤으로, 독자에게 긍정적인 영향을 주는 표현을 사용하세요.',
      educational: '교육적이고 설명하는 톤으로, 개념을 명확히 전달하고 이해하기 쉽게 작성하세요.',
      conversational: '대화형 톤으로, 독자와 직접 대화하는 듯한 친근하고 자연스러운 언어를 사용하세요.'
    };

    // 대상 독자에 따른 설정
    const audienceMap = {
      general: '일반 대중을 대상으로, 전문 용어는 최소화하고 누구나 이해할 수 있게 작성하세요.',
      beginners: '해당 주제에 대한 기초 지식이 없는 초보자를 위해, 기본 개념부터 설명하고 전문 용어를 풀어서 설명하세요.',
      intermediate: '기본 지식은 있지만 더 깊은 이해를 원하는 중급자를 위해, 기초적인 설명은 줄이고 심화 내용을 포함하세요.',
      experts: '해당 분야에 대한 전문 지식을 가진 전문가를 위해, 고급 개념과 최신 트렌드, 깊이 있는 분석을 포함하세요.',
      professionals: '관련 직종에 종사하는 전문 직업인을 위해, 실무에 적용할 수 있는 구체적인 팁과 사례를 포함하세요.',
      students: '학생들을 대상으로 교육적 목적의 글로, 개념을 체계적으로 설명하고 이해를 돕는 예시를 포함하세요.'
    };

    // 길이에 따른 구조 설정
    const structurePrompt = length < 400 
      ? '간결하게 핵심만 다루는 짧은 글로 작성하세요.' 
      : length > 800 
        ? '서론, 본론(여러 소제목으로 구분), 결론 구조로 상세하게 작성하세요.' 
        : '적절한 길이로 주요 포인트를 충분히 설명하되 불필요한 내용은 제외하세요.';

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `당신은 전문적인 블로그 작가입니다. 
          SEO에 최적화된 고품질 블로그 글을 작성합니다.
          
          다음 지침을 따라주세요:
          1. 제목은 SEO에 효과적인 형태로 만들고, 제목 아래에 배치하세요.
          2. 글은 HTML 태그 없이 마크다운 형식으로 작성하세요.
          3. 주제와 관련된 소제목을 적절히 사용하세요.
          4. 약 ${length} 단어 분량으로 작성하세요.
          5. ${toneMap[tone]}
          6. ${audienceMap[audience]}
          7. ${structurePrompt}
          8. ${keywordPrompt}
          9. 독자의 관심을 끄는 훌륭한 서론으로 시작하세요.
          10. 결론에서는 주요 포인트를 요약하고 독자에게 행동을 촉구하세요.
          11. 전체적으로 읽기 쉽고 매력적인 글을 작성하세요.
          12. 매우 중요: $ 기호를 절대 사용하지 마세요. 금액이나 수학 표현에 달러 기호가 필요하면 '달러'라고 표기하세요.
          13. 특히 '$2'와 같은 형식은 절대로 사용하지 마세요. 숫자만 표기하거나 '2'와 같이 작성하세요.`
        },
        {
          role: "user",
          content: `"${topic}"에 대한 블로그 글을 작성해주세요.`
        }
      ],
      temperature: 0.7,
    });

    // $ 기호 처리
    let content = completion.choices[0].message.content || '';
    
    // $2와 같은 패턴을 찾아서 처리
    content = content.replace(/\$(\d+)/g, (match, number) => {
      return number;
    });

    return NextResponse.json({
      content: content,
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: '블로그 글을 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 