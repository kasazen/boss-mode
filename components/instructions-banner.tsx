'use client';

import { Upload, Mic, Command, MessageSquare } from 'lucide-react';

export function InstructionsBanner() {
  return (
    <div className="mb-8 grid grid-cols-4 gap-4">
      {/* Upload Files */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-700/50 rounded-lg p-4 hover:border-blue-600/70 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Upload className="text-blue-400" size={20} />
          </div>
          <h3 className="font-semibold text-blue-100">Upload Files</h3>
        </div>
        <p className="text-sm text-slate-300">
          Drag & drop notes, docs, or PDFs to extract projects automatically
        </p>
      </div>

      {/* Voice Memos */}
      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-700/50 rounded-lg p-4 hover:border-purple-600/70 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Mic className="text-purple-400" size={20} />
          </div>
          <h3 className="font-semibold text-purple-100">Voice Memos</h3>
        </div>
        <p className="text-sm text-slate-300">
          Record 30-sec updates that automatically map to projects
        </p>
      </div>

      {/* Quick Capture */}
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-700/50 rounded-lg p-4 hover:border-green-600/70 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-500/20 p-2 rounded-lg">
            <Command className="text-green-400" size={20} />
          </div>
          <h3 className="font-semibold text-green-100">Quick Capture</h3>
        </div>
        <p className="text-sm text-slate-300">
          Press <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">⌘K</kbd> to add single-sentence updates
        </p>
      </div>

      {/* AI Assistant */}
      <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/10 border border-amber-700/50 rounded-lg p-4 hover:border-amber-600/70 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-500/20 p-2 rounded-lg">
            <MessageSquare className="text-amber-400" size={20} />
          </div>
          <h3 className="font-semibold text-amber-100">AI Assistant</h3>
        </div>
        <p className="text-sm text-slate-300">
          Ask questions about projects, risks, and priorities
        </p>
      </div>
    </div>
  );
}
