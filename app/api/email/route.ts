import { NextResponse } from 'next/server';
import { parseEmail } from '@/lib/parsers/email';
import { loadState, saveState } from '@/lib/state/nexus-state';
import { ingestFiles } from '@/lib/ai/ingest-engine';
import { FileSource, FileMetadata } from '@/lib/parsers';

class EmailFileSource implements FileSource {
  constructor(
    private emailBody: string,
    private emailSubject: string,
    private timestamp: Date
  ) {}

  async getFiles(): Promise<FileMetadata[]> {
    return [
      {
        id: `email-${this.timestamp.getTime()}`,
        name: `${this.emailSubject}.txt`,
        mimeType: 'text/plain',
        path: '',
      },
    ];
  }

  async readFile(): Promise<string> {
    return this.emailBody;
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const rawEmail = formData.get('email') as string;

    if (!rawEmail) {
      return NextResponse.json({ error: 'No email content provided' }, { status: 400 });
    }

    const { subject, body, timestamp } = await parseEmail(rawEmail);

    const state = loadState();
    const source = new EmailFileSource(body, subject, timestamp);

    const projects = await ingestFiles(source, state);

    const projectMap = new Map(state.projects.map((p) => [p.id, p]));

    projects.forEach((project) => {
      if (project.id && projectMap.has(project.id)) {
        projectMap.set(project.id, project);
      } else {
        projectMap.set(project.id, project);
      }
    });

    state.projects = Array.from(projectMap.values());
    state.metadata.totalFilesProcessed += 1;
    saveState(state);

    return NextResponse.json({ success: true, projectsUpdated: projects.length });
  } catch (error) {
    console.error('Email processing error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
