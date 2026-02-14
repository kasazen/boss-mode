'use client';

import { Project } from '@/lib/schema';
import { useState } from 'react';
import { ProjectDetailModal } from './project-detail-modal';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';

type SortField = 'ceoPriority' | 'stakeholderUrgency' | 'status' | 'name' | 'deadline';
type SortDirection = 'asc' | 'desc';

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortField, setSortField] = useState<SortField>('ceoPriority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Sorting logic
  const sortedProjects = [...projects].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle undefined deadline
    if (sortField === 'deadline') {
      if (!aValue) return 1;
      if (!bValue) return -1;
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    const multiplier = sortDirection === 'asc' ? 1 : -1;

    if (aValue < bValue) return -1 * multiplier;
    if (aValue > bValue) return 1 * multiplier;
    return 0;
  });

  // Toggle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Render sortable header
  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-4 py-3 text-left font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortField === field && (
          sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
        )}
      </div>
    </th>
  );

  const getPriorityColor = (priority: number) => {
    if (priority >= 7) return 'bg-red-900/20 text-red-400 border border-red-500/50';
    if (priority >= 4) return 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/50';
    return 'bg-slate-800 text-slate-400 border border-slate-700';
  };

  const getSentimentEmoji = (sentiment: string) => {
    const map = {
      calm: '😌',
      concerned: '😟',
      frustrated: '😤',
      furious: '😡',
    };
    return map[sentiment as keyof typeof map] || '—';
  };

  const getSentimentColor = (sentiment: string) => {
    const map = {
      calm: 'text-green-400',
      concerned: 'text-yellow-400',
      frustrated: 'text-orange-400',
      furious: 'text-red-400',
    };
    return map[sentiment as keyof typeof map] || 'text-slate-400';
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border border-green-500/50',
    blocked: 'bg-red-500/20 text-red-400 border border-red-500/50',
    completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
    archived: 'bg-slate-500/20 text-slate-400 border border-slate-500/50',
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto max-h-[600px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10">
            <tr>
              <SortableHeader field="name" label="Name" />
              <SortableHeader field="ceoPriority" label="Priority" />
              <SortableHeader field="stakeholderUrgency" label="Urgency" />
              <SortableHeader field="status" label="Status" />
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Sentiment</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Recent Update</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">Key Risk</th>
              <SortableHeader field="deadline" label="Deadline" />
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project, index) => {
              const isCritical = project.ceoPriority >= 7 && project.stakeholderUrgency >= 7;
              const recentUpdate = project.history.length > 0
                ? project.history[project.history.length - 1].change
                : 'No updates';
              const keyRisk = project.keyRisks.length > 0
                ? project.keyRisks[0]
                : 'No risks identified';

              return (
                <tr
                  key={project.id}
                  className={`
                    cursor-pointer hover:bg-slate-800 transition-all
                    ${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'}
                    ${isCritical ? 'border-l-4 border-amber-500' : ''}
                  `}
                  onClick={() => setSelectedProject(project)}
                >
                  <td className="px-4 py-3 font-semibold text-white">{project.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${getPriorityColor(project.ceoPriority)}`}>
                      {project.ceoPriority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${getPriorityColor(project.stakeholderUrgency)}`}>
                      {project.stakeholderUrgency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xl ${getSentimentColor(project.stakeholderSentiment)}`}>
                      {getSentimentEmoji(project.stakeholderSentiment)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{recentUpdate}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm max-w-xs truncate">{keyRisk}</td>
                  <td className="px-4 py-3 text-slate-300 text-sm">
                    {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'No deadline'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No projects found. Upload files to get started.
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
