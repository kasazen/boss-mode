import { loadState } from '@/lib/state/nexus-state';
import { Heatmap } from '@/components/heatmap';
import { ChatPanel } from '@/components/chat-panel';
import { QuickCaptureBar } from '@/components/quick-capture-bar';
import { VoiceRecorder } from '@/components/voice-recorder';
import { ConflictAlerts } from '@/components/conflict-alert';
import { IngestionTrigger } from '@/components/ingestion-trigger';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const state = loadState();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">CEO Strategic Nexus</h1>
          <p className="text-slate-400 mt-2">
            {state.projects.length} projects | Quality Score: {state.metadata.qualityScore}
          </p>
        </div>
        <div className="flex gap-2">
          <VoiceRecorder />
          <IngestionTrigger />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl mb-4">Priority Heatmap</h2>
          <Heatmap projects={state.projects} />
        </div>

        <div>
          <h2 className="text-2xl mb-4">Strategic Assistant</h2>
          <ChatPanel />
        </div>
      </div>

      <QuickCaptureBar />
      <ConflictAlerts conflicts={state.conflicts} />

      <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Press ⌘K for quick capture</li>
          <li>• Click Voice Memo to record audio updates</li>
          <li>• Drop files in /ingest folder and click Ingest Files</li>
          <li>• Ask the Strategic Assistant for insights</li>
        </ul>
      </div>
    </main>
  );
}
