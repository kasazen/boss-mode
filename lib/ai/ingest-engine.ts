import { anthropic } from './client';
import { INGESTION_SYSTEM_PROMPT, buildIngestionPrompt } from './ingestion-prompts';
import { FileSource } from '@/lib/parsers';
import { Project, NexusState } from '@/lib/schema';
import crypto from 'crypto';

export async function ingestFiles(
  source: FileSource,
  existingState: NexusState
): Promise<Project[]> {
  const files = await source.getFiles();
  const allProjects: Project[] = [];

  for (const file of files) {
    const content = await source.readFile(file.id);
    const extractedProjects = await extractProjects(content, file.name);

    for (const extracted of extractedProjects) {
      const existing = existingState.projects.find((p) => p.name === extracted.name);

      if (existing) {
        const merged = await upsertProject(existing, extracted, file.name);
        allProjects.push(merged);
      } else {
        allProjects.push({
          ...extracted,
          id: crypto.randomUUID(),
          history: [
            {
              timestamp: new Date().toISOString(),
              change: 'Project created from initial ingestion',
              captureMethod: 'file' as const,
            },
          ],
        });
      }
    }
  }

  return allProjects;
}

async function upsertProject(
  existing: Project,
  updated: Partial<Project>,
  sourceFile: string
): Promise<Project> {
  const changes = detectChanges(existing, updated);
  const changeSummary = await generateChangeSummary(existing, updated, changes);

  return {
    ...existing,
    ...updated,
    id: existing.id,
    sourceFile,
    lastUpdated: new Date().toISOString(),
    history: [
      ...existing.history,
      {
        timestamp: new Date().toISOString(),
        change: changeSummary,
        captureMethod: 'file' as const,
      },
    ],
  };
}

function detectChanges(existing: Project, updated: Partial<Project>): string[] {
  const changes: string[] = [];

  if (updated.ceoPriority !== undefined && updated.ceoPriority !== existing.ceoPriority) {
    changes.push(`ceoPriority: ${existing.ceoPriority} → ${updated.ceoPriority}`);
  }
  if (
    updated.stakeholderUrgency !== undefined &&
    updated.stakeholderUrgency !== existing.stakeholderUrgency
  ) {
    changes.push(`stakeholderUrgency: ${existing.stakeholderUrgency} → ${updated.stakeholderUrgency}`);
  }
  if (
    updated.stakeholderSentiment !== undefined &&
    updated.stakeholderSentiment !== existing.stakeholderSentiment
  ) {
    changes.push(`stakeholderSentiment: ${existing.stakeholderSentiment} → ${updated.stakeholderSentiment}`);
  }
  if (updated.status !== undefined && updated.status !== existing.status) {
    changes.push(`status: ${existing.status} → ${updated.status}`);
  }

  return changes;
}

async function generateChangeSummary(
  existing: Project,
  updated: Partial<Project>,
  changes: string[]
): Promise<string> {
  if (changes.length === 0) return 'No significant changes detected';

  const prompt = `Summarize why these project metrics changed in 1 concise sentence:

Project: ${existing.name}
Changes: ${changes.join(', ')}
New context: ${updated.notes || 'No new context'}

Focus on the strategic reason (e.g., "Stakeholder escalated urgency due to missed deadline").`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  });

  const textContent = response.content[0];
  return textContent.type === 'text' ? textContent.text.trim() : 'Updated via file ingestion';
}

async function extractProjects(content: string, fileName: string): Promise<Partial<Project>[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 8192,
    system: INGESTION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildIngestionPrompt(content, fileName),
      },
    ],
  });

  const textContent = response.content[0];
  const responseText = textContent.type === 'text' ? textContent.text : '{"projects":[]}';

  const extracted = JSON.parse(responseText);

  return extracted.projects.map((p: any) => ({
    ...p,
    sourceFile: fileName,
    lastUpdated: new Date().toISOString(),
    stakeholderUrgency:
      p.stakeholderSentiment === 'furious' && p.stakeholderUrgency < 8
        ? 8
        : p.stakeholderUrgency,
  }));
}
