'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';

export function QuickCaptureBar() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/quick-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const result = await response.json();
      console.log('Quick capture result:', result);

      setInput('');
      setOpen(false);

      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Quick capture error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl"
    >
      <Command.Input
        placeholder="Quick capture (e.g., 'Project X is now top priority because board asked')"
        value={input}
        onValueChange={setInput}
        className="w-full bg-transparent border-0 border-b border-slate-700 px-4 py-3 text-lg focus:outline-none"
        disabled={loading}
      />
      <Command.List className="p-2">
        <Command.Item
          onSelect={handleSubmit}
          className="px-4 py-2 rounded cursor-pointer hover:bg-slate-800 transition-colors"
        >
          {loading ? 'Capturing...' : 'Quick Capture'}
        </Command.Item>
      </Command.List>
    </Command.Dialog>
  );
}
