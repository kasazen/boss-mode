import { NextResponse } from 'next/server';
import path from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { transcribeAudio } from '@/lib/parsers/audio';
import { loadState, saveState } from '@/lib/state/nexus-state';
import { processQuickCapture } from '@/lib/ai/quick-capture';

export async function POST(req: Request) {
  let audioPath: string | null = null;

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    audioPath = path.join(process.cwd(), 'audio', `${Date.now()}.webm`);
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    writeFileSync(audioPath, buffer);

    const transcript = await transcribeAudio(audioPath);

    const state = loadState();
    const result = await processQuickCapture(transcript, state, 'voice');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Voice processing error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    if (audioPath) {
      try {
        unlinkSync(audioPath);
      } catch (e) {
        console.error('Failed to cleanup audio file:', e);
      }
    }
  }
}
