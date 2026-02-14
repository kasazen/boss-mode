import { NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import path from 'path';
import { loadState, saveState } from '@/lib/state/nexus-state';
import { LocalFileSource } from '@/lib/parsers';
import { ingestFiles } from '@/lib/ai/ingest-engine';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Save files to ingest directory
    const ingestDir = path.join(process.cwd(), 'ingest');
    const savedFiles: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(ingestDir, file.name);
      writeFileSync(filePath, buffer);
      savedFiles.push(file.name);
    }

    // Process files through ingestion engine
    const state = loadState();
    const source = new LocalFileSource(ingestDir);
    const ingestedProjects = await ingestFiles(source, state);

    // Update state
    const projectMap = new Map(state.projects.map(p => [p.id, p]));
    ingestedProjects.forEach(ingested => {
      if (ingested.id && projectMap.has(ingested.id)) {
        projectMap.set(ingested.id, ingested);
      } else {
        projectMap.set(ingested.id, ingested);
      }
    });

    state.projects = Array.from(projectMap.values());
    state.metadata.totalFilesProcessed += savedFiles.length;
    state.metadata.lastIngestion = new Date().toISOString();
    saveState(state);

    return NextResponse.json({
      success: true,
      filesUploaded: savedFiles.length,
      projectsExtracted: ingestedProjects.length,
      fileNames: savedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
