import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { QuizResult } from '@/lib/quiz-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, totalQuestions, correctAnswers, score } = body;

    const prompt = `
당신은 Cursor AI 퀴즈 결과를 분석하는 전문가입니다.
다음 퀴즈 결과를 분석하고 JSON 형태로 피드백을 제공해주세요:

총 문제 수: ${totalQuestions}
정답 수: ${correctAnswers}
점수: ${score}점 (${Math.round((correctAnswers / totalQuestions) * 100)}%)

각 문제별 답변:
${answers.map((answer: any, index: number) => 
  `${index + 1}. 사용자 답변: ${answer.userAnswer + 1}번, 정답: ${answer.correctAnswer + 1}번, ${answer.isCorrect ? '정답' : '오답'}`
).join('\n')}

다음 JSON 형식으로 응답해주세요:
{
  "analysis": {
    "overallScore": ${score},
    "percentage": ${Math.round((correctAnswers / totalQuestions) * 100)},
    "strengths": ["강점1", "강점2"],
    "weaknesses": ["개선점1", "개선점2"],
    "recommendations": ["추천사항1", "추천사항2"]
  },
  "detailedFeedback": {
    "grade": "A|B|C|D|F",
    "message": "전체적인 피드백 메시지",
    "nextSteps": "다음 단계 제안"
  },
  "questionAnalysis": [
    {
      "questionId": 1,
      "userAnswer": 1,
      "correctAnswer": 1,
      "isCorrect": true,
      "feedback": "이 문제에 대한 구체적인 피드백"
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "당신은 Cursor AI 퀴즈 결과를 분석하는 전문가입니다. 항상 JSON 형식으로 응답해주세요."
        },
        {
          role: "user",
          content: prompt
        }
      ]
      // response_format 옵션 제거
    });

    const result = completion.choices[0].message.content;
    let jsonResult;
    try {
      jsonResult = JSON.parse(result || '{}');
    } catch (e) {
      console.error('OpenAI 응답 파싱 오류:', result);
      return NextResponse.json(
        { success: false, error: 'AI 응답이 올바른 JSON이 아닙니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: jsonResult
    });

  } catch (error) {
    console.error('Quiz result API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '퀴즈 결과 처리 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 