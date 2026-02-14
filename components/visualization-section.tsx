'use client';

import { Project } from '@/lib/schema';
import { useState } from 'react';
import { ViewToggle } from './view-toggle';
import { Heatmap } from './heatmap';
import { ProjectTable } from './project-table';

export type ViewMode = 'heatmap' | 'table';

interface VisualizationSectionProps {
  projects: Project[];
}

export function VisualizationSection({ projects }: VisualizationSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Priority Visualization</h2>
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {viewMode === 'heatmap' ? (
        <Heatmap projects={projects} />
      ) : (
        <ProjectTable projects={projects} />
      )}
    </div>
  );
}
