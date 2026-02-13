import { anthropic } from './client';
import { ConflictAlert, Project } from '@/lib/schema';
import crypto from 'crypto';

export async function detectConflicts(
  existing: Project,
  update: Partial<Project>
): Promise<ConflictAlert[]> {
  const conflicts: ConflictAlert[] = [];
  const recentHistory = existing.history.slice(-5);
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

  const recentChanges = recentHistory.filter(
    (h) => new Date(h.timestamp).getTime() > twoHoursAgo
  );

  if (recentChanges.length === 0) return [];

  // Detect priority shift
  if (update.ceoPriority !== undefined) {
    const recentPriorityIncrease = recentChanges.some(
      (h) => h.change.toLowerCase().includes('priority') && h.change.includes('increased')
    );

    if (recentPriorityIncrease && update.ceoPriority < existing.ceoPriority) {
      const analysis = await analyzeConflict(existing, update, 'priority_shift', recentChanges);

      conflicts.push({
        id: crypto.randomUUID(),
        projectId: existing.id,
        projectName: existing.name,
        timestamp: new Date().toISOString(),
        conflictType: 'priority_shift',
        previousValue: `${existing.ceoPriority} (increased recently)`,
        newValue: `${update.ceoPriority} (now decreasing)`,
        aiAnalysis: analysis,
        resolved: false,
      });
    }
  }

  // Detect urgency spike
  if (
    update.stakeholderUrgency !== undefined &&
    update.stakeholderUrgency > existing.stakeholderUrgency + 3
  ) {
    const analysis = await analyzeConflict(existing, update, 'urgency_spike', recentChanges);

    conflicts.push({
      id: crypto.randomUUID(),
      projectId: existing.id,
      projectName: existing.name,
      timestamp: new Date().toISOString(),
      conflictType: 'urgency_spike',
      previousValue: `${existing.stakeholderUrgency}`,
      newValue: `${update.stakeholderUrgency} (+${update.stakeholderUrgency - existing.stakeholderUrgency})`,
      aiAnalysis: analysis,
      resolved: false,
    });
  }

  // Detect sentiment change
  if (update.stakeholderSentiment && update.stakeholderSentiment !== existing.stakeholderSentiment) {
    const sentimentMap: Record<string, number> = {
      calm: 0,
      concerned: 1,
      frustrated: 2,
      furious: 3,
    };
    const prevSeverity = sentimentMap[existing.stakeholderSentiment];
    const newSeverity = sentimentMap[update.stakeholderSentiment];

    if (newSeverity > prevSeverity) {
      const analysis = await analyzeConflict(existing, update, 'sentiment_change', recentChanges);

      conflicts.push({
        id: crypto.randomUUID(),
        projectId: existing.id,
        projectName: existing.name,
        timestamp: new Date().toISOString(),
        conflictType: 'sentiment_change',
        previousValue: existing.stakeholderSentiment,
        newValue: update.stakeholderSentiment,
        aiAnalysis: analysis,
        resolved: false,
      });
    }
  }

  return conflicts;
}

async function analyzeConflict(
  existing: Project,
  update: Partial<Project>,
  conflictType: string,
  recentHistory: any[]
): Promise<string> {
  const prompt = `Analyze this potential conflict in project data:

Project: ${existing.name}
Conflict Type: ${conflictType}
Recent History (last 2 hours):
${recentHistory.map((h) => `- ${h.timestamp}: ${h.change}`).join('\n')}

Current State: ${JSON.stringify({
    priority: existing.ceoPriority,
    urgency: existing.stakeholderUrgency,
    sentiment: existing.stakeholderSentiment,
  })}

Incoming Update: ${JSON.stringify(update)}

Question: Does this update contradict recent changes? If yes, explain the strategic implication in 1 sentence.
If no conflict, return "No conflict detected."`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const textContent = response.content[0];
  return textContent.type === 'text' ? textContent.text.trim() : 'No conflict detected.';
}
