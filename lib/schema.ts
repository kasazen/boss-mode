import { z } from 'zod';

export const HistoryEntrySchema = z.object({
  timestamp: z.string().datetime(),
  change: z.string(),
  captureMethod: z.enum(['file', 'voice', 'email', 'quick-capture']),
});

export const ConflictAlertSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  projectName: z.string(),
  timestamp: z.string().datetime(),
  conflictType: z.enum([
    'priority_shift',
    'urgency_spike',
    'status_reversal',
    'sentiment_change',
  ]),
  previousValue: z.string(),
  newValue: z.string(),
  aiAnalysis: z.string(),
  resolved: z.boolean(),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  ceoPriority: z.number().min(0).max(10),
  stakeholderUrgency: z.number().min(0).max(10),
  stakeholderSentiment: z.enum(['calm', 'concerned', 'frustrated', 'furious']),
  status: z.enum(['active', 'blocked', 'completed', 'archived']),
  deadline: z.string().datetime().optional(),
  notes: z.string(),
  keyRisks: z.array(z.string()),
  dependencies: z.array(z.string()),
  history: z.array(HistoryEntrySchema),
  sourceFile: z.string().optional(),
  lastUpdated: z.string().datetime(),
});

export const NexusStateSchema = z.object({
  version: z.literal('1.0'),
  projects: z.array(ProjectSchema),
  conflicts: z.array(ConflictAlertSchema),
  metadata: z.object({
    lastIngestion: z.string().datetime().optional(),
    totalFilesProcessed: z.number(),
    qualityScore: z.number().min(0).max(100),
  }),
});

export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;
export type ConflictAlert = z.infer<typeof ConflictAlertSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type NexusState = z.infer<typeof NexusStateSchema>;
