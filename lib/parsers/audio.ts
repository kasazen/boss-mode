import { openai } from '@/lib/ai/client';
import fs from 'fs';

export async function transcribeAudio(audioFilePath: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-proj-YOUR_KEY_HERE') {
    throw new Error('OpenAI API key required for audio transcription');
  }

  const audioStream = fs.createReadStream(audioFilePath);

  const transcription = await openai.audio.transcriptions.create({
    file: audioStream,
    model: 'whisper-1',
    language: 'en',
    response_format: 'text',
  });

  return transcription as unknown as string;
}
