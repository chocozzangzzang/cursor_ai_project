import { NextResponse } from 'next/server';
import openai from '@/lib/openai';

interface RoleAIRequest {
  role: string;
  prompt: string;
  systemMessage: string;
}

export async function POST(request: Request) {
  try {
    const { role, prompt, systemMessage } = await request.json() as RoleAIRequest;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'AI 응답을 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 