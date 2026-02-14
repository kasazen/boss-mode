'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.name.endsWith('.md') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.docx')
    );

    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFiles([]);
        window.location.reload(); // Refresh to show new projects
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept=".md,.txt,.pdf,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <Upload className="mx-auto mb-4 text-slate-400" size={48} />
        <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
        <p className="text-sm text-slate-400">
          Supports: Markdown (.md), Text (.txt), PDF (.pdf), Word (.docx)
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-300">
            {files.length} file{files.length > 1 ? 's' : ''} ready to upload
          </h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-400" size={20} />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 py-3 rounded-lg font-semibold transition-colors"
          >
            {uploading ? 'Processing...' : `Upload & Analyze ${files.length} File${files.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
}
