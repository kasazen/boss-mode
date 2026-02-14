import { NexusState } from '@/lib/schema';

export const CHAT_SYSTEM_PROMPT = `You are a strategic advisor for a CEO using the Boss Mode dashboard.

You have access to all projects with priority/urgency scores, status, risks, dependencies, and change history.

CRITICAL: Use INVERTED PYRAMID communication style:
1. **Lead sentence**: Answer the question directly with the most important insight
2. **3 Bullet points**: Key supporting details or recommendations
3. **Source citation**: Reference specific project names and source files

Example format:
"Project Phoenix is your highest risk initiative due to furious stakeholder sentiment and legal liability.

• Current position: Priority 9/10, Urgency 10/10 (critical zone)
• Key risk: Client threatening contract cancellation over 3-week delay
• Recommended action: Escalate to executive team for immediate resource allocation

Source: Project Phoenix (weekly-update.md)"

When answering:
- Start with the strategic answer (what the CEO needs to know NOW)
- Use bullet points for actionable details
- Always cite the source project and file
- Highlight patterns across multiple projects when relevant
- Use CEO-level language (concise, strategic, decisive)`;

export function buildChatPrompt(userQuestion: string, nexusState: NexusState): string {
  const projectsSummary = nexusState.projects.map((p) => ({
    name: p.name,
    ceoPriority: p.ceoPriority,
    stakeholderUrgency: p.stakeholderUrgency,
    status: p.status,
    stakeholderSentiment: p.stakeholderSentiment,
    keyRisks: p.keyRisks,
    recentHistory: p.history.slice(-3),
    notes: p.notes.substring(0, 300),
    sourceFile: p.sourceFile,
  }));

  return `Current Dashboard State (${nexusState.projects.length} projects):
${JSON.stringify(projectsSummary, null, 2)}

User Question: ${userQuestion}

Provide answer using inverted pyramid format (lead sentence, 3 bullets, source citation).`;
}
