'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export function IngestionTrigger() {
  const [loading, setLoading] = useState(false);

  const handleIngest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ingest', { method: 'POST' });
      const result = await response.json();

      if (result.success) {
        alert(`Successfully ingested ${result.count} projects!`);
        window.location.reload();
      } else {
        alert('Ingestion failed. Check console for details.');
      }
    } catch (error) {
      console.error('Ingestion error:', error);
      alert('Ingestion failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleIngest}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
    >
      <Upload size={18} />
      {loading ? 'Ingesting...' : 'Ingest Files'}
    </button>
  );
}
