import React, { useState, useEffect } from 'react';

interface FileCapsuleProps {
  key?: string;
  file: File;
  onRemove: () => void;
}

export function FileCapsule({ file, onRemove }: FileCapsuleProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [durationStr, setDurationStr] = useState<string>('00:12');

  const fileType = (() => {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/') || /\.(mp4|mov|webm|mkv|avi)$/i.test(name)) return 'video';
    if (type.startsWith('audio/') || /\.(mp3|m4a|wav|aac|ogg|flac|wma)$/i.test(name)) return 'audio';
    if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
    return 'file';
  })();

  useEffect(() => {
    if (fileType === 'image' || fileType === 'video' || fileType === 'audio') {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);

      if (fileType === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;
        video.onloadedmetadata = () => {
          if (video.duration && !isNaN(video.duration)) {
            const mins = Math.floor(video.duration / 60);
            const secs = Math.floor(video.duration % 60);
            setDurationStr(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
          }
        };
      }

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setObjectUrl(null);
    }
  }, [file, fileType]);

  // Common close button component matching Gemini's white circle with black X
  const CloseButton = () => (
    <button
      type="button"
      onClick={onRemove}
      className="w-5 h-5 bg-white hover:bg-slate-200 text-black rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow z-10 border border-slate-300/80 ml-auto"
      aria-label="Supprimer le fichier"
      title="Supprimer"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  );

  // Render Image Capsule
  if (fileType === 'image') {
    return (
      <div className="relative inline-flex shrink-0 items-center my-1">
        <div className="w-28 h-10 rounded-full overflow-hidden bg-[#282a2d] border border-slate-700/60 shadow-md flex items-center justify-between px-1.5 relative">
          {objectUrl && (
            <img
              src={objectUrl}
              alt={file.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Subtle dark gradient overlay so close button is always visible */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="w-full flex items-center justify-end relative z-10">
            <CloseButton />
          </div>
        </div>
      </div>
    );
  }

  // Render Video Capsule
  if (fileType === 'video') {
    return (
      <div className="relative inline-flex shrink-0 items-center my-1">
        <div className="w-32 h-10 rounded-full overflow-hidden bg-[#282a2d] border border-slate-700/60 shadow-md flex items-center justify-between px-2 relative">
          {objectUrl && (
            <video
              src={objectUrl}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] relative z-10 font-mono tracking-tight pl-1">
            {durationStr}
          </span>
          <CloseButton />
        </div>
      </div>
    );
  }

  // Render Audio Capsule
  if (fileType === 'audio') {
    return (
      <div className="relative inline-flex shrink-0 items-center my-1">
        <div className="h-10 px-3 bg-[#2d3034] hover:bg-[#35383d] transition-colors border border-slate-700/50 shadow-md rounded-full flex items-center gap-2.5 max-w-[200px]">
          {/* Red square badge with white headphones */}
          <div className="w-6 h-6 rounded-md bg-[#eb4335] flex items-center justify-center shrink-0 text-white shadow-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z" />
              <path d="M18 14h3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" />
              <path d="M2 14a10 10 0 0 1 20 0" />
            </svg>
          </div>
          <span className="text-xs text-slate-100 font-medium truncate max-w-[110px]">
            {file.name}
          </span>
          <CloseButton />
        </div>
      </div>
    );
  }

  // Render PDF Capsule
  if (fileType === 'pdf') {
    return (
      <div className="relative inline-flex shrink-0 items-center my-1">
        <div className="h-10 px-3 bg-[#2d3034] hover:bg-[#35383d] transition-colors border border-slate-700/50 shadow-md rounded-full flex items-center gap-2.5 max-w-[200px]">
          {/* Red square badge with PDF text */}
          <div className="w-6 h-6 rounded-md bg-[#eb4335] flex items-center justify-center shrink-0 text-white shadow-sm">
            <span className="text-[9px] font-black tracking-tighter">PDF</span>
          </div>
          <span className="text-xs text-slate-100 font-medium truncate max-w-[110px]">
            {file.name}
          </span>
          <CloseButton />
        </div>
      </div>
    );
  }

  // Render Generic / Code / Document File Capsule (e.g. .gitignore, .txt, .js)
  return (
    <div className="relative inline-flex shrink-0 items-center my-1">
      <div className="h-10 px-3 bg-[#2d3034] hover:bg-[#35383d] transition-colors border border-slate-700/50 shadow-md rounded-full flex items-center gap-2.5 max-w-[200px]">
        {/* Blue square badge with document icon */}
        <div className="w-6 h-6 rounded-md bg-[#1a73e8] flex items-center justify-center shrink-0 text-white shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        </div>
        <span className="text-xs text-slate-100 font-medium truncate max-w-[110px]">
          {file.name}
        </span>
        <CloseButton />
      </div>
    </div>
  );
}
