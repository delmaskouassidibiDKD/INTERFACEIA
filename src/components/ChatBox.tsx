import React, { useRef, useEffect, useState } from 'react';
import { FileCapsule } from './FileCapsule';

interface ChatBoxProps {
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  onSend: (message: string) => void;
  webSearch: boolean;
  setWebSearch: (val: boolean | ((prev: boolean) => boolean)) => void;
  imageMode: boolean;
  setImageMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSettings: () => void;
  attachedFile?: File | null;
  setAttachedFile?: (file: File | null) => void;
  attachedFiles?: File[];
  setAttachedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  onFocus?: () => void;
  onBlur?: () => void;
  variant?: 'default' | 'compact';
}

export default function ChatBox({
  inputMessage,
  setInputMessage,
  onSend,
  webSearch,
  setWebSearch,
  imageMode,
  setImageMode,
  onOpenSettings,
  attachedFile,
  setAttachedFile,
  attachedFiles = [],
  setAttachedFiles,
  onFocus,
  onBlur,
  variant = 'default',
}: ChatBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageGalleryInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Normalize files array from either attachedFiles or attachedFile prop
  const currentFiles = attachedFiles.length > 0 ? attachedFiles : (attachedFile ? [attachedFile] : []);

  const [showMaxError, setShowMaxError] = useState(false);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = variant === 'compact' ? 90 : 160;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputMessage, variant]);

  // Setup Web Speech API for Mic Button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'fr-FR';

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputMessage(transcript);
          }
        };

        recog.onerror = () => {
          setIsRecording(false);
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recog);
      }
    }
  }, [setInputMessage]);

  const handleMicClick = () => {
    if (isRecording) {
      if (recognition) recognition.stop();
      setIsRecording(false);
    } else {
      if (recognition) {
        try {
          recognition.start();
          setIsRecording(true);
        } catch {
          setIsRecording(true);
        }
      } else {
        // Fallback simulation if speech recognition not supported in iframe environment
        setIsRecording(true);
        setTimeout(() => {
          setInputMessage('Explique-moi les concepts de l\'intelligence artificielle moderne.');
          setIsRecording(false);
        }, 1800);
      }
    }
  };

  const handleSend = () => {
    if (!inputMessage.trim() && currentFiles.length === 0) return;

    setIsSending(true);
    setTimeout(() => {
      onSend(inputMessage.trim());
      setInputMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = variant === 'compact' ? '22px' : '52px';
      }
      setIsSending(false);
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const triggerFileSelect = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (currentFiles.length >= 10) {
      setShowMaxError(true);
      setTimeout(() => setShowMaxError(false), 3500);
      return;
    }
    inputRef.current?.click();
  };

  const [maxErrorMsg, setMaxErrorMsg] = useState<string>("Maximum 10 éléments : Seules les 10 premières images sont conservées.");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      if (setAttachedFiles) {
        const currentCount = currentFiles.length;
        if (currentCount >= 10) {
          setMaxErrorMsg("Maximum 10 images atteint ! Impossible d'en ajouter d'autres.");
          setShowMaxError(true);
          setTimeout(() => setShowMaxError(false), 4500);
        } else if (currentCount + selected.length > 10) {
          setMaxErrorMsg(`Limite de 10 images : Seules les 10 premières ont été retenues (${selected.length} sélectionnées).`);
          setShowMaxError(true);
          setTimeout(() => setShowMaxError(false), 4500);
          const allowed = selected.slice(0, 10 - currentCount);
          setAttachedFiles((prev) => [...prev, ...allowed]);
        } else {
          setAttachedFiles((prev) => [...prev, ...selected]);
        }
      } else if (setAttachedFile) {
        setAttachedFile(selected[0] as File);
      }
      e.target.value = '';
    }
  };

  const removeFileAtIndex = (index: number) => {
    if (setAttachedFiles) {
      setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    } else if (setAttachedFile) {
      setAttachedFile(null);
    }
  };

  return (
    <div className={`chat-box ${variant === 'compact' ? 'compact' : ''}`}>
      {/* Maximum 10 files alert notification */}
      {showMaxError && (
        <div className="mx-4 mt-2 p-2.5 bg-amber-500/10 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs text-amber-300 shadow-md transition-all animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <span><strong>Limite 10 fichiers :</strong> {maxErrorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowMaxError(false)}
            className="text-amber-400 hover:text-white px-1 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Attached files thumbnail banner */}
      {currentFiles.length > 0 && (
        <div className="pt-3 px-4 flex flex-row items-center gap-2.5 overflow-x-auto custom-scrollbar">
          {currentFiles.map((file, index) => (
            <FileCapsule
              key={`${file.name}-${file.size}-${index}`}
              file={file}
              onRemove={() => removeFileAtIndex(index)}
            />
          ))}
          {currentFiles.length < 10 ? (
            <button
              type="button"
              onClick={() => triggerFileSelect(imageGalleryInputRef)}
              className="w-28 h-16 rounded-full border-2 border-dashed border-slate-600 hover:border-blue-500 bg-[#161d28]/60 flex flex-col items-center justify-center shrink-0 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer my-1"
              title="Ajouter d'autres images (jusqu'à 10)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-[10px] font-semibold mt-0.5">{currentFiles.length}/10</span>
            </button>
          ) : (
            <div className="w-28 h-16 rounded-full border border-amber-500/50 bg-amber-500/10 flex flex-col items-center justify-center shrink-0 text-amber-400 my-1 px-2 text-center">
              <span className="text-[10px] font-bold">10/10</span>
              <span className="text-[9px] font-medium leading-none mt-0.5">Max atteint</span>
            </div>
          )}
        </div>
      )}

      {/* Active mode indicators */}
      {(webSearch || imageMode) && (
        <div className="mx-4 mt-2 flex gap-2">
          {webSearch && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(0,212,170,0.15)] text-[#00d4aa] border border-[rgba(0,212,170,0.2)] flex items-center gap-1">
              🌐 Web Search Active
            </span>
          )}
          {imageMode && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(0,168,232,0.15)] text-[#00a8e8] border border-[rgba(0,168,232,0.2)] flex items-center gap-1">
              🎨 Image Analysis Mode
            </span>
          )}
        </div>
      )}

      <div className="input-area">
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Type your message here..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          rows={1}
        />
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          {/* Attach file button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            type="button"
            className="tool-btn"
            onClick={() => triggerFileSelect(fileInputRef)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </button>

          {/* Web search button */}
          <button
            type="button"
            className={`tool-btn search-btn ${webSearch ? 'active' : ''}`}
            onClick={() => setWebSearch((prev) => !prev)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
          </button>

          <div className="divider" />

          {/* Camera photo button */}
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            type="button"
            className="tool-btn"
            onClick={() => triggerFileSelect(cameraInputRef)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
          </button>

          {/* Image gallery button */}
          <input
            type="file"
            ref={imageGalleryInputRef}
            accept="image/*"
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            type="button"
            className="tool-btn"
            onClick={() => triggerFileSelect(imageGalleryInputRef)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
          </button>
          {/* Microphone button */}
          <button
            type="button"
            className={`tool-btn mic-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleMicClick}
            title="Entrée vocale"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </button>
        </div>

        <div className="toolbar-right">
          {/* Send button */}
          <button
            type="button"
            className={`send-btn ${isSending ? 'sending' : ''}`}
            onClick={handleSend}
            disabled={!inputMessage.trim() && currentFiles.length === 0}
            aria-label="Send message"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
