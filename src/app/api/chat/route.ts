import { NextResponse } from 'next/server';
import openai from '@/lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: '챗봇 응답을 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 