import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { NexusState, NexusStateSchema } from '@/lib/schema';

const STATE_PATH = path.join(process.cwd(), 'data', 'nexus_state.json');

export function loadState(): NexusState {
  const raw = readFileSync(STATE_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  return NexusStateSchema.parse(parsed);
}

export function saveState(state: NexusState): void {
  const validated = NexusStateSchema.parse(state);
  writeFileSync(STATE_PATH, JSON.stringify(validated, null, 2), 'utf-8');
}
