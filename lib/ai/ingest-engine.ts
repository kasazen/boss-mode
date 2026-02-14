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

  // Step 1: Process files sequentially with delay to avoid rate limits
  // (These are large meeting transcripts ~500KB each)
  const extractionResults: Array<{ file: any; extracted: Partial<Project>[] }> = [];

  for (const file of files) {
    try {
      const content = await source.readFile(file.id);
      const extracted = await extractProjects(content, file.name);
      extractionResults.push({ file, extracted });

      // Delay between files to avoid rate limits (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      // Continue with next file instead of failing completely
    }
  }

  // Step 2: Process upserts sequentially to avoid state conflicts
  for (const { file, extracted } of extractionResults) {
    for (const extractedProject of extracted) {
      const existing = existingState.projects.find((p) => p.name === extractedProject.name);

      if (existing) {
        const merged = await upsertProject(existing, extractedProject, file.name);
        allProjects.push(merged);
      } else {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name: extractedProject.name || 'Unnamed Project',
          description: extractedProject.description || '',
          ceoPriority: extractedProject.ceoPriority ?? 5,
          stakeholderUrgency: extractedProject.stakeholderUrgency ?? 5,
          stakeholderSentiment: extractedProject.stakeholderSentiment || 'calm',
          status: extractedProject.status || 'active',
          deadline: extractedProject.deadline,
          notes: extractedProject.notes || '',
          keyRisks: extractedProject.keyRisks || [],
          dependencies: extractedProject.dependencies || [],
          history: [
            {
              timestamp: new Date().toISOString(),
              change: 'Project created from initial ingestion',
              captureMethod: 'file' as const,
            },
          ],
          sourceFile: extractedProject.sourceFile,
          lastUpdated: extractedProject.lastUpdated || new Date().toISOString(),
        };
        allProjects.push(newProject);
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
  let responseText = textContent.type === 'text' ? textContent.text : '{"projects":[]}';

  // Strip markdown code blocks if present (more robust)
  responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // Find JSON object if wrapped in other text
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    responseText = jsonMatch[0];
  }

  const extracted = JSON.parse(responseText);

  return extracted.projects.map((p: any) => ({
    ...p,
    sourceFile: fileName,
    lastUpdated: new Date().toISOString(),
    deadline: p.deadline || undefined, // Convert null to undefined
    stakeholderUrgency:
      p.stakeholderSentiment === 'furious' && p.stakeholderUrgency < 8
        ? 8
        : p.stakeholderUrgency,
  }));
}
