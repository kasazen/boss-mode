'use client';

import { Grid, List } from 'lucide-react';
import { ViewMode } from './visualization-section';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('heatmap')}
        className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${
          viewMode === 'heatmap'
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Grid size={18} />
        Heatmap
      </button>
      <button
        onClick={() => onViewModeChange('table')}
        className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${
          viewMode === 'table'
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <List size={18} />
        Table
      </button>
    </div>
  );
}
