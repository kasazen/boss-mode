import { NextResponse } from 'next/server';
import path from 'path';
import { loadState, saveState } from '@/lib/state/nexus-state';
import { LocalFileSource } from '@/lib/parsers';
import { ingestFiles } from '@/lib/ai/ingest-engine';

export async function POST(req: Request) {
  try {
    const state = loadState();
    const source = new LocalFileSource(path.join(process.cwd(), 'ingest'));

    const ingestedProjects = await ingestFiles(source, state);

    const projectMap = new Map(state.projects.map((p) => [p.id, p]));

    ingestedProjects.forEach((ingested) => {
      if (ingested.id && projectMap.has(ingested.id)) {
        projectMap.set(ingested.id, ingested);
      } else {
        projectMap.set(ingested.id, ingested);
      }
    });

    state.projects = Array.from(projectMap.values());
    state.metadata.totalFilesProcessed += 1;
    state.metadata.lastIngestion = new Date().toISOString();
    saveState(state);

    return NextResponse.json({ success: true, count: ingestedProjects.length });
  } catch (error) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
