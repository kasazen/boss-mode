'use client';

import { useState, useRef } from 'react';
import { Mic, Upload } from 'lucide-react';

export function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 30000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVoiceMemo = async () => {
    if (!audioBlob) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'memo.webm');

      const response = await fetch('/api/voice', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Voice memo result:', result);

      setAudioBlob(null);

      // Reload to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Voice upload error:', error);
      alert('Failed to process voice memo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {!audioBlob ? (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={uploading}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Mic size={18} />
          {isRecording ? 'Recording...' : 'Voice Memo'}
        </button>
      ) : (
        <button
          onClick={uploadVoiceMemo}
          disabled={uploading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Upload size={18} />
          {uploading ? 'Uploading...' : 'Upload Memo'}
        </button>
      )}
    </div>
  );
}
