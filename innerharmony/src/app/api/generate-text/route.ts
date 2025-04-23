import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { concern } = await request.json();

    if (!concern) {
      return NextResponse.json(
        { error: 'Concern is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a compassionate and professional mental health counselor. 
          Provide supportive, empathetic, and practical advice for the user's concern. 
          Focus on active listening, validation, and offering constructive suggestions. 
          Keep the response between 200-300 words.`,
        },
        {
          role: 'user',
          content: concern,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const text = completion.choices[0].message.content;

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating text:', error);
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
} 