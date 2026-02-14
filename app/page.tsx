import { loadState } from '@/lib/state/nexus-state';
import { VisualizationSection } from '@/components/visualization-section';
import { ChatPanel } from '@/components/chat-panel';
import { QuickCaptureBar } from '@/components/quick-capture-bar';
import { VoiceRecorder } from '@/components/voice-recorder';
import { ConflictAlerts } from '@/components/conflict-alert';
import { IngestionTrigger } from '@/components/ingestion-trigger';
import { InstructionsBanner } from '@/components/instructions-banner';
import { FileUpload } from '@/components/file-upload';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const state = loadState();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Boss Mode</h1>
          <p className="text-slate-400 mt-2">
            {state.projects.length} projects | Quality Score: {state.metadata.qualityScore}
          </p>
        </div>
        <div className="flex gap-2">
          <VoiceRecorder />
          <IngestionTrigger />
        </div>
      </div>

      <InstructionsBanner />

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl mb-4">Upload Files</h2>
            <FileUpload />
          </div>
          <div>
            <VisualizationSection projects={state.projects} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl mb-4">AI Assistant</h2>
          <ChatPanel />
        </div>
      </div>

      <QuickCaptureBar />
      <ConflictAlerts conflicts={state.conflicts} />
    </main>
  );
}
