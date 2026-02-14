'use client';

import { Project } from '@/lib/schema';
import { X, AlertTriangle, Clock, TrendingUp, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const sentimentColors = {
    calm: 'text-green-400',
    concerned: 'text-yellow-400',
    frustrated: 'text-orange-400',
    furious: 'text-red-400',
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/50',
    blocked: 'bg-red-500/20 text-red-400 border-red-500/50',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    archived: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="relative ml-auto w-2/3 bg-slate-900 border-l border-slate-700 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
            <p className="text-slate-300">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">CEO Priority</div>
              <div className="text-3xl font-bold text-blue-400">{project.ceoPriority}/10</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Stakeholder Urgency</div>
              <div className="text-3xl font-bold text-red-400">{project.stakeholderUrgency}/10</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Status</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[project.status]}`}>
                {project.status.toUpperCase()}
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Sentiment</div>
              <div className={`text-2xl font-bold capitalize ${sentimentColors[project.stakeholderSentiment]}`}>
                {project.stakeholderSentiment}
              </div>
            </div>
          </div>

          {/* Key Risks */}
          {project.keyRisks.length > 0 && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-red-400" size={24} />
                <h3 className="text-xl font-semibold text-red-100">Key Risks</h3>
              </div>
              <ul className="space-y-2">
                {project.keyRisks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span className="text-slate-200">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dependencies */}
          {project.dependencies.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={24} />
                Dependencies
              </h3>
              <ul className="space-y-2">
                {project.dependencies.map((dep, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">→</span>
                    <span className="text-slate-200">{dep}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {project.notes && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText size={24} />
                Notes
              </h3>
              <div className="text-slate-200 whitespace-pre-wrap">{project.notes}</div>
            </div>
          )}

          {/* Change History */}
          {project.history.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock size={24} />
                Change History
              </h3>
              <div className="space-y-4">
                {project.history.map((entry, index) => (
                  <div key={index} className="border-l-2 border-slate-700 pl-4">
                    <div className="text-sm text-slate-400 mb-1">
                      {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                      <span className="ml-2 px-2 py-0.5 bg-slate-700 rounded text-xs">
                        {entry.captureMethod}
                      </span>
                    </div>
                    <div className="text-slate-200">{entry.change}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-sm text-slate-400 space-y-1">
            {project.sourceFile && (
              <div>Source: <span className="text-slate-300">{project.sourceFile}</span></div>
            )}
            <div>Last Updated: <span className="text-slate-300">
              {format(new Date(project.lastUpdated), 'MMM d, yyyy h:mm a')}
            </span></div>
            <div>Project ID: <span className="font-mono text-xs text-slate-500">{project.id}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
