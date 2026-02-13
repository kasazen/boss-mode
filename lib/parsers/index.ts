import { readFileSync } from 'fs';
import path from 'path';

export interface FileSource {
  getFiles(): Promise<FileMetadata[]>;
  readFile(fileId: string): Promise<string>;
}

export interface FileMetadata {
  id: string;
  name: string;
  mimeType: string;
  path: string;
}

export class LocalFileSource implements FileSource {
  constructor(private directory: string) {}

  async getFiles(): Promise<FileMetadata[]> {
    const fs = await import('fs');
    const files = fs.readdirSync(this.directory);

    return files
      .filter((name) => name !== '.gitkeep')
      .map((name) => ({
        id: name,
        name,
        mimeType: this.getMimeType(name),
        path: path.join(this.directory, name),
      }));
  }

  async readFile(fileId: string): Promise<string> {
    const metadata = (await this.getFiles()).find((f) => f.id === fileId);
    if (!metadata) throw new Error('File not found');

    return parseFile(metadata.path, metadata.mimeType);
  }

  private getMimeType(filename: string): string {
    if (filename.endsWith('.md')) return 'text/markdown';
    if (filename.endsWith('.txt')) return 'text/plain';
    if (filename.endsWith('.pdf')) return 'application/pdf';
    if (filename.endsWith('.docx'))
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    return 'application/octet-stream';
  }
}

export async function parseFile(filePath: string, mimeType: string): Promise<string> {
  switch (mimeType) {
    case 'text/markdown':
    case 'text/plain':
      return readFileSync(filePath, 'utf-8');
    case 'application/pdf':
      const pdfParse = (await import('pdf-parse')).default;
      const pdfBuffer = readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      return pdfData.text;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      const mammoth = await import('mammoth');
      const docxBuffer = readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: docxBuffer });
      return result.value;
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
