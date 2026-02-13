import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state/nexus-state';
import { processQuickCapture } from '@/lib/ai/quick-capture';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const state = loadState();
    const result = await processQuickCapture(text, state, 'quick-capture');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Quick capture error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
