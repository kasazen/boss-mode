'use client';

import { ConflictAlert } from '@/lib/schema';
import { AlertTriangle, X } from 'lucide-react';

interface ConflictAlertsProps {
  conflicts: ConflictAlert[];
}

export function ConflictAlerts({ conflicts }: ConflictAlertsProps) {
  const unresolvedConflicts = conflicts.filter((c) => !c.resolved);

  if (unresolvedConflicts.length === 0) return null;

  const resolveConflict = async (conflictId: string) => {
    console.log('Resolving conflict:', conflictId);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-md space-y-2 z-50">
      {unresolvedConflicts.map((conflict) => (
        <div
          key={conflict.id}
          className="bg-amber-900/90 border border-amber-500 rounded-lg p-4 shadow-2xl"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-100">{conflict.projectName}</h3>
              <p className="text-sm text-amber-200 mt-1">{conflict.aiAnalysis}</p>
              <div className="mt-2 text-xs text-amber-300">
                {conflict.previousValue} → {conflict.newValue}
              </div>
            </div>
            <button
              onClick={() => resolveConflict(conflict.id)}
              className="text-amber-400 hover:text-amber-200 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
