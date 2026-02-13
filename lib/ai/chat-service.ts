import { anthropic } from './client';
import { CHAT_SYSTEM_PROMPT, buildChatPrompt } from './chat-prompts';
import { NexusState } from '@/lib/schema';

export async function getChatResponse(question: string, state: NexusState): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    system: CHAT_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildChatPrompt(question, state),
      },
    ],
  });

  const textContent = response.content[0];
  return textContent.type === 'text' ? textContent.text : 'Unable to generate response';
}
