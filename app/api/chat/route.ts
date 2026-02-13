import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state/nexus-state';
import { getChatResponse } from '@/lib/ai/chat-service';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const state = loadState();

    const answer = await getChatResponse(question, state);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
