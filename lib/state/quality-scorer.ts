import { NexusState } from '@/lib/schema';

export function calculateQualityScore(state: NexusState): number {
  let score = 100;

  state.projects.forEach((p) => {
    if (!p.description || p.description.length < 10) score -= 2;
    if (p.keyRisks.length === 0) score -= 1;
  });

  const daysSinceIngest = state.metadata.lastIngestion
    ? (Date.now() - new Date(state.metadata.lastIngestion).getTime()) / 86400000
    : 999;
  if (daysSinceIngest > 7) score -= 10;

  return Math.max(0, score);
}
