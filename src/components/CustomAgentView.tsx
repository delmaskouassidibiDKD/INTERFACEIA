import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  Paperclip,
  Globe,
  Camera,
  Image as ImageIcon,
  Mic,
  Send,
  ArrowLeft,
  Plus,
  X,
  Check
} from 'lucide-react';
import DotField from './DotField';
import Strands from './Strands';
import { BlueRobot } from './BlueRobot';
import ChatThread, { ChatMessage } from './ChatThread';

interface CustomAgentViewProps {
  agentName: string;
  userName?: string;
  messages: ChatMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (val: string) => void;
  onSend: (text: string) => void;
  onOpenMenu: () => void;
  onBackToHub: () => void;
  onNewChat?: () => void;
  webSearch: boolean;
  setWebSearch: (val: boolean) => void;
  imageMode: boolean;
  setImageMode: (val: boolean) => void;
  onOpenSettings: () => void;
  attachedFiles: File[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function CustomAgentView({
  agentName,
  userName = 'DIBI Kouassi delmas...',
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  onSend,
  onOpenMenu,
  onBackToHub,
  onNewChat,
  webSearch,
  setWebSearch,
  imageMode,
  setImageMode,
  onOpenSettings,
  attachedFiles,
  setAttachedFiles,
}: CustomAgentViewProps) {
  const displayAgentName = (!agentName || agentName === "Créateur d'Agents") ? "Agent Delmas" : agentName;
  const [modelMode, setModelMode] = useState<'Instant High' | 'Pro 2.5' | 'Ultra 3.0'>('Instant High');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea logic as user types with a max height limit
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = 150; // Maximum height limit before scrolling
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [inputMessage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setAttachedFiles((prev) => {
        const combined = [...prev, ...selected];
        return combined.slice(0, 10);
      });
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0a0c10] text-slate-100 font-sans antialiased">
      {/* 1. TOP HEADER - Sleek compact header bar fitting strictly around the buttons */}
      <header className="fixed top-0 left-0 right-0 z-50 h-9 px-3 bg-[#0a0c10]/95 backdrop-blur-md border-b border-slate-800/70">
        <div className="max-w-2xl mx-auto w-full h-full flex items-center justify-between">
          {/* Left: Hamburger menu & Agent Name */}
          <div className="flex items-center gap-2 truncate pr-2">
            <button
              onClick={onOpenMenu}
              className="w-7 h-7 rounded-full bg-[#161a22] hover:bg-[#1f2530] border border-slate-800/80 flex items-center justify-center text-slate-200 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
              title="Ouvrir le menu"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-3.5 h-3.5 text-slate-200" />
            </button>
            <span className="font-semibold text-xs sm:text-sm text-slate-100 truncate tracking-tight">
              {displayAgentName}
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* New Conversation Button */}
            {onNewChat && (
              <button
                onClick={onNewChat}
                className="w-7 h-7 rounded-full bg-[#161a22] hover:bg-[#1f2530] border border-slate-800/80 flex items-center justify-center text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
                title="Nouvelle conversation"
                aria-label="Nouvelle conversation"
              >
                <Plus className="w-3.5 h-3.5 text-slate-200" />
              </button>
            )}

            {/* Back Arrow Button */}
            <button
              onClick={onBackToHub}
              className="w-7 h-7 rounded-full bg-[#161a22] hover:bg-[#1f2530] border border-slate-800/80 flex items-center justify-center text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
              title="Retour à l'accueil"
              aria-label="Retour"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-200" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CENTER CONTENT VIEW */}
      {!hasMessages ? (
        /* LANDING VIEW */
        displayAgentName === "Agent Delmas" ? (
          <main className="relative z-10 flex-1 flex flex-col items-center justify-between pb-2 px-3 pt-12 min-h-screen overflow-hidden">
            <DotField className="absolute inset-0 pointer-events-none opacity-50 z-0" />

            <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4 max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-5 tracking-tight">
                Agent Delmas
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto px-2">
                {[
                  { label: 'Website', icon: '🌐' },
                  { label: 'Mobile', icon: '📱' },
                  { label: 'Design', icon: '🎨' },
                  { label: 'Slides', icon: '🖥️' },
                  { label: 'Animation', icon: '🎬' },
                  { label: 'Data', icon: '📊' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setInputMessage(`Créer une application ${chip.label}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181c26]/90 hover:bg-slate-800 border border-slate-700/70 text-xs font-medium text-slate-200 hover:text-white transition-all active:scale-95 shadow-md cursor-pointer"
                  >
                    <span className="text-sm">{chip.icon}</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="h-16" />
          </main>
        ) : (
          <main className="relative z-10 flex-1 flex flex-col items-center justify-between pb-2 px-3 pt-12 min-h-screen overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <Strands
                  colors={["#06B6D4","#3B82F6","#1D4ED8"]}
                  count={3}
                  speed={0.4}
                  amplitude={0.95}
                  waviness={0.95}
                  thickness={0.6}
                  glow={2.0}
                  taper={3}
                  spread={1}
                  intensity={0.48}
                  saturation={1.4}
                  opacity={0.78}
                  scale={1.5}
                  glass={false}
                  refraction={1}
                  dispersion={1}
                  glassSize={1}
                  hueShift={0}
                />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4 max-w-lg mx-auto">
              <div className="relative mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 animate-pulse pointer-events-none" />
                <div className="relative z-10 w-20 h-20 rounded-full bg-slate-900/85 border border-blue-400/40 flex items-center justify-center p-1 shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                  <BlueRobot className="w-16 h-16" />
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-normal text-slate-100 tracking-tight leading-relaxed">
                Bonjour <span className="font-semibold text-white">{userName}</span>, que souhaitez-vous faire avec <span className="font-semibold text-blue-400">{displayAgentName}</span> aujourd'hui ?
              </h1>
            </div>
            <div className="h-16" />
          </main>
        )
      ) : (
        /* MESSAGES STREAM VIEW - Clean without dark overlay tint */
        <main className="relative z-10 flex-1 flex flex-col pt-10 pb-28 justify-between overflow-y-auto">
          <ChatThread
            messages={messages}
            isLoading={isLoading}
            onNewChat={onNewChat || (() => {})}
          />
        </main>
      )}

      {/* 3. BOTTOM CHAT INPUT BAR - Pinned fixed at bottom edge */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-2.5 pb-3 pt-2 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/95 to-transparent">
        <div className="w-full max-w-xl mx-auto">
          {/* Attached Files Preview Badges */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1 px-1">
              {attachedFiles.map((f, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-200"
                >
                  <Paperclip className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[120px]">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-slate-400 hover:text-white ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative bg-[#131720] border border-slate-800/90 rounded-2xl px-2.5 py-1.5 shadow-xl flex flex-col gap-1 transition-all focus-within:border-slate-700">
            {/* Main Input Textarea */}
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputMessage.trim() || attachedFiles.length > 0) {
                    onSend(inputMessage);
                  }
                }
              }}
              placeholder={`Demandez quelque chose à ${displayAgentName}...`}
              rows={1}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none px-1 py-0.5 min-h-[28px] max-h-[150px] overflow-y-auto"
            />

            {/* Action Tools Row */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
              {/* Left Media & Tools with comfortable spacing */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Joindre un fichier"
                >
                  <Paperclip className="w-5 h-5 text-slate-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setWebSearch(!webSearch)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    webSearch ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                  title="Recherche Web"
                >
                  <Globe className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Prendre une photo"
                >
                  <Camera className="w-5 h-5 text-slate-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setImageMode(!imageMode)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    imageMode ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                  title="Mode Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Right Side: Mic & Send Button with generous spacing */}
              <div className="flex items-center gap-4 sm:gap-5">
                <button
                  type="button"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Entrée vocale"
                >
                  <Mic className="w-5 h-5 text-slate-300" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (inputMessage.trim() || attachedFiles.length > 0) {
                      onSend(inputMessage);
                    }
                  }}
                  disabled={!inputMessage.trim() && attachedFiles.length === 0}
                  className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:hover:bg-blue-600 transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center shrink-0"
                  title="Envoyer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
