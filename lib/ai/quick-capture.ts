import { anthropic } from './client';
import { QUICK_CAPTURE_SYSTEM_PROMPT, buildQuickCapturePrompt } from './ingestion-prompts';
import { NexusState, ConflictAlert } from '@/lib/schema';
import { detectConflicts } from './conflict-detector';
import { saveState } from '@/lib/state/nexus-state';
import crypto from 'crypto';

export async function processQuickCapture(
  text: string,
  state: NexusState,
  method: 'quick-capture' | 'voice'
): Promise<{ projectsUpdated: string[]; conflicts: ConflictAlert[] }> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: QUICK_CAPTURE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildQuickCapturePrompt(text, state),
      },
    ],
  });

  const textContent = response.content[0];
  let responseText = textContent.type === 'text' ? textContent.text : '{}';

  // Strip markdown code blocks if present
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  const update = JSON.parse(responseText);

  const project = state.projects.find((p) =>
    p.name.toLowerCase().includes(update.projectName.toLowerCase())
  );

  if (!project) {
    const newProject = {
      id: crypto.randomUUID(),
      name: update.projectName,
      description: update.description || text,
      ceoPriority: update.ceoPriority || 5,
      stakeholderUrgency: update.stakeholderUrgency || 5,
      stakeholderSentiment: update.stakeholderSentiment || 'calm',
      status: 'active' as const,
      notes: text,
      keyRisks: [],
      dependencies: [],
      history: [
        {
          timestamp: new Date().toISOString(),
          change: `Created via ${method}: ${text}`,
          captureMethod: method,
        },
      ],
      lastUpdated: new Date().toISOString(),
    };

    state.projects.push(newProject);
    saveState(state);

    return { projectsUpdated: [newProject.name], conflicts: [] };
  }

  const conflicts = await detectConflicts(project, update);

  project.ceoPriority = update.ceoPriority ?? project.ceoPriority;
  project.stakeholderUrgency = update.stakeholderUrgency ?? project.stakeholderUrgency;
  project.stakeholderSentiment = update.stakeholderSentiment ?? project.stakeholderSentiment;
  project.notes = text + '\n\n' + project.notes;
  project.history.push({
    timestamp: new Date().toISOString(),
    change: update.changeSummary || `Updated via ${method}`,
    captureMethod: method,
  });
  project.lastUpdated = new Date().toISOString();

  if (conflicts.length > 0) {
    state.conflicts.push(...conflicts);
  }

  saveState(state);

  return { projectsUpdated: [project.name], conflicts };
}
