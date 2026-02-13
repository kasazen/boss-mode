'use client';

import { Project } from '@/lib/schema';
import { useState } from 'react';

interface HeatmapProps {
  projects: Project[];
}

function getBivariateColor(
  priority: number,
  urgency: number,
  projectCount: number
): {
  background: string;
  isCritical: boolean;
} {
  const pNorm = priority / 10;
  const uNorm = urgency / 10;

  const blueIntensity = pNorm * 200;
  const redIntensity = uNorm * 200;
  const greenIntensity = 0;

  const baseOpacity = projectCount > 0 ? 0.4 : 0.1;
  const countFactor = Math.min(projectCount * 0.2, 0.6);
  const opacity = baseOpacity + countFactor;

  const isCritical = priority >= 7 && urgency >= 7;

  return {
    background: `rgba(${redIntensity}, ${greenIntensity}, ${blueIntensity}, ${opacity})`,
    isCritical,
  };
}

export function Heatmap({ projects }: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ priority: number; urgency: number } | null>(
    null
  );

  const grid: Project[][][] = Array.from({ length: 11 }, () =>
    Array.from({ length: 11 }, () => [])
  );

  projects.forEach((project) => {
    const priority = Math.round(project.ceoPriority);
    const urgency = Math.round(project.stakeholderUrgency);
    grid[urgency][priority].push(project);
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(0, 0, 200, 0.6)' }} />
          <span>High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(200, 0, 0, 0.6)' }} />
          <span>High Urgency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(200, 0, 200, 0.6)' }} />
          <span>Critical (Both)</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold text-slate-300">
          Stakeholder Urgency
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-slate-300">
          CEO Priority
        </div>

        <div className="grid grid-rows-11 gap-1 p-4 bg-slate-900 rounded-lg border border-slate-800">
          {grid
            .slice()
            .reverse()
            .map((row, rowIndex) => {
              const urgency = 10 - rowIndex;
              return (
                <div key={urgency} className="grid grid-cols-11 gap-1">
                  {row.map((cell, colIndex) => {
                    const priority = colIndex;
                    const { background, isCritical } = getBivariateColor(
                      priority,
                      urgency,
                      cell.length
                    );

                    const criticalClasses =
                      isCritical && cell.length > 0
                        ? 'critical-cell ring-2 ring-amber-500'
                        : '';

                    return (
                      <div
                        key={`${priority}-${urgency}`}
                        data-testid={`heatmap-cell-${priority}-${urgency}`}
                        className={`heatmap-cell ${criticalClasses} cursor-pointer relative group`}
                        style={{ background }}
                        onMouseEnter={() => setHoveredCell({ priority, urgency })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {cell.length > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {cell.length}
                          </div>
                        )}

                        {hoveredCell?.priority === priority &&
                          hoveredCell?.urgency === urgency &&
                          cell.length > 0 && (
                            <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl min-w-[250px] max-w-[400px]">
                              <div className="space-y-2">
                                {cell.map((project) => (
                                  <div key={project.id} className="border-b border-slate-700 pb-2">
                                    <div className="font-semibold text-white">{project.name}</div>
                                    <div className="text-xs text-slate-300">
                                      {project.description}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                      Status: {project.status} | Sentiment:{' '}
                                      {project.stakeholderSentiment}
                                    </div>
                                    {project.history.length > 0 && (
                                      <div className="text-xs text-slate-500 mt-1">
                                        Last: {project.history[project.history.length - 1].change}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
