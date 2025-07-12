import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { count, genre } = await request.json();

    // 프롬프트 예시 (장르와 개수에 맞게 문제 생성)
    const prompt = `
너는 퀴즈 출제자야. 장르: ${genre}, 문제 수: ${count}개.
아래와 같은 JSON 배열로 4지선다 객관식 문제를 만들어줘.

[
  {
    "question": "문제 내용",
    "choices": ["선택지1", "선택지2", "선택지3", "선택지4"],
    "answer": 0 // 정답 인덱스(0~3)
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "항상 JSON만 반환하세요." },
        { role: "user", content: prompt }
      ]
    });

    // 응답에서 JSON 파싱
    const result = completion.choices[0].message.content;
    let questions;
    try {
      questions = JSON.parse(result || '[]');
    } catch {
      return NextResponse.json({ success: false, error: "AI 응답 파싱 실패" }, { status: 500 });
    }

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    return NextResponse.json({ success: false, error: "문제 생성 중 오류 발생" }, { status: 500 });
  }
} 