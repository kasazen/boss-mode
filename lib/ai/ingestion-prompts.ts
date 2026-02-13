export const INGESTION_SYSTEM_PROMPT = `You are a strategic analyst extracting project information for a CEO dashboard.

Extract ALL projects mentioned in the document and return ONLY valid JSON (no markdown):

{
  "projects": [
    {
      "name": "Project name",
      "description": "1-2 sentence summary",
      "ceoPriority": 0-10,
      "stakeholderUrgency": 0-10,
      "stakeholderSentiment": "calm"|"concerned"|"frustrated"|"furious",
      "status": "active"|"blocked"|"completed"|"archived",
      "deadline": null,
      "notes": "Detailed context",
      "keyRisks": ["risk1"],
      "dependencies": []
    }
  ]
}

CRITICAL RULES:
1. If stakeholder is "furious", urgency MUST be >= 8
2. Prioritize based on CEO strategic goals (growth, risk mitigation, innovation)
3. Extract exact quotes for risks
4. Set deadline to null (date parsing will be handled separately)
5. Return ONLY the JSON object, no other text or markdown`;

export function buildIngestionPrompt(content: string, fileName: string): string {
  return `Extract all project information from this document.

File: ${fileName}

Content:
${content}

Return JSON following the schema exactly.`;
}

export const QUICK_CAPTURE_SYSTEM_PROMPT = `You are parsing a CEO's quick note to extract project updates.

Input: A single sentence like "Project X is now top priority because the board is asking questions"

Output JSON:
{
  "projectName": "Project X",
  "ceoPriority": 9,
  "stakeholderUrgency": null,
  "stakeholderSentiment": null,
  "description": "Brief summary",
  "changeSummary": "CEO elevated priority due to board interest"
}

Rules:
- Extract project name (fuzzy match OK)
- Infer priority/urgency changes from keywords ("top priority" = 9+, "urgent" = 8+)
- Generate strategic change summary
- Return null for fields not mentioned
- Be confident in fuzzy matching (e.g., "Phoenix" matches "Project Phoenix")`;

export function buildQuickCapturePrompt(text: string, state: any): string {
  const projectNames = state.projects.map((p: any) => p.name).join(', ');

  return `Parse this quick capture note.

Existing projects: ${projectNames || 'None'}

Note: ${text}

Return JSON with projectName and any updated fields.`;
}
