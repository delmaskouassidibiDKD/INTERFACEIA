import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatThread';
import { FileCapsule } from './FileCapsule';
import DotField from './DotField';

interface ConstructeurWorkspaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
  onSend: (text: string) => void;
  onExit: () => void;
  onSwitchToChat?: () => void;
  onOpenMenu?: () => void;
  attachedFile?: File | null;
  setAttachedFile?: (file: File | null) => void;
  attachedFiles?: File[];
  setAttachedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ConstructeurWorkspace({
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  onSend,
  onExit,
  onSwitchToChat,
  onOpenMenu,
  attachedFile,
  setAttachedFile,
  attachedFiles = [],
  setAttachedFiles,
}: ConstructeurWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'agent' | 'preview' | 'code' | 'terminal' | 'split'>('agent');
  const [planMode, setPlanMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Economy');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const [expandedActions, setExpandedActions] = useState<Record<string, boolean>>({});
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [selectedCodeFile, setSelectedCodeFile] = useState('App.tsx');

  // Normalize files array from either attachedFiles or attachedFile prop
  const currentFiles = attachedFiles.length > 0 ? attachedFiles : (attachedFile ? [attachedFile] : []);

  const [showMaxError, setShowMaxError] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new message arrives if at bottom
  useEffect(() => {
    if (chatContainerRef.current && activeTab === 'agent') {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setShowScrollToLatest(false);
    }
  }, [messages, isLoading, activeTab]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // Only show scroll button if user has scrolled up away from bottom by > 40px
    if (scrollHeight - scrollTop - clientHeight > 40) {
      setShowScrollToLatest(true);
    } else {
      setShowScrollToLatest(false);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setShowScrollToLatest(false);
    }
  };

  const toggleActions = (msgId: string) => {
    setExpandedActions((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && currentFiles.length === 0) return;
    let text = inputMessage;
    if (planMode) {
      text = `[Mode Planification] ${text}`;
    }
    onSend(text);
    setInputMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const [maxErrorMsg, setMaxErrorMsg] = useState<string>("Maximum 10 éléments : Seules les 10 premières images sont conservées.");

  const triggerFileSelect = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (currentFiles.length >= 10) {
      setMaxErrorMsg("Maximum 10 images atteint ! Impossible d'en ajouter d'autres.");
      setShowMaxError(true);
      setTimeout(() => setShowMaxError(false), 4500);
      return;
    }
    inputRef.current?.click();
  };

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

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';

    if (!isVoiceRecording) {
      setIsVoiceRecording(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (typeof setInputMessage === 'function') {
          const newMsg = inputMessage ? `${inputMessage} ${transcript}` : transcript;
          setInputMessage(newMsg);
        }
        setIsVoiceRecording(false);
      };
      recognition.onerror = () => setIsVoiceRecording(false);
      recognition.onend = () => setIsVoiceRecording(false);
    } else {
      setIsVoiceRecording(false);
    }
  };

  // Mock generated files for code viewer
  const mockFiles: Record<string, string> = {
    'App.tsx': `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="p-8 bg-slate-900 text-white min-h-screen">\n      <h1 className="text-3xl font-bold">Projet Agent Delmas</h1>\n      <p className="mt-4 text-slate-400">\n        Ce projet a été généré en langage naturel par Agent Delmas.\n      </p>\n    </div>\n  );\n}`,
    'package.json': `{\n  "name": "delmas-app",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}`,
    'server.ts': `import express from 'express';\nconst app = express();\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok', engine: 'Agent Delmas' });\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));`,
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-[#121418] text-slate-100 font-sans select-none overflow-hidden">
      {/* 1. TOP HEADER */}
      <header className="h-14 px-4 bg-[#181a20] border-b border-slate-800/80 flex items-center justify-between shrink-0 relative z-20">
        {/* Left: Hamburger Drawer Menu Button */}
        <div className="flex items-center gap-2">
          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-800 active:scale-95 cursor-pointer"
              title="Ouvrir le menu Agent Delmas"
              aria-label="Ouvrir le menu Agent Delmas"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Centered Agent Title */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
          <span className="font-bold text-base md:text-lg text-slate-100 tracking-tight">
            Agent <span className="text-amber-400">Delmas</span>
          </span>
        </div>

        {/* Right: Return to Chats Button matching Image 1 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-[#181c26] hover:bg-slate-800 text-slate-200 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold border border-slate-700/70 shadow-sm cursor-pointer"
            aria-label="Retour aux chats"
            title="Retour aux chats"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Chats</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE VIEW BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Dot Field background matrix */}
        <DotField className="absolute inset-0 pointer-events-none opacity-50 z-0" />

        {/* LEFT / CENTER PANEL: AGENT CHAT STREAM */}
        <div
          className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300 z-10 ${
            activeTab === 'split' ? 'w-1/2 border-r border-slate-800' : 'w-full'
          }`}
        >
          {/* Messages Scroll Area */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar pb-6 flex flex-col"
          >
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-end pb-6 text-center my-auto">
                {/* Big Title matching Image 1 */}
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-5 tracking-tight">
                  Agent <span className="text-amber-400">Delmas</span>
                </h1>

                {/* Category Chips row matching Image 1 */}
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
            )}

            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const actionsKey = msg.id;
              const isActionsExpanded = expandedActions[actionsKey] ?? true;

              if (isUser) {
                return (
                  <div key={msg.id} className="flex flex-col items-end my-3">
                    <div className="max-w-[88%] bg-[#1a2536] border border-blue-900/40 text-slate-100 text-sm md:text-[15px] px-4 py-3 rounded-2xl shadow-sm leading-relaxed">
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 mr-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              }

              // Assistant Agent Response
              return (
                <div key={msg.id} className="flex flex-col items-start my-4 space-y-3">
                  {/* Collapsible Action Bar (Matching Image: 🧠 >_ 🧠 3 actions) */}
                  <div className="w-full max-w-xl">
                    <button
                      onClick={() => toggleActions(actionsKey)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181d26] hover:bg-[#1e2430] border border-slate-800 text-xs text-slate-300 transition-all font-mono shadow-sm"
                    >
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <span>🧠</span>
                        <span>&gt;_</span>
                        <span>🧠</span>
                      </span>
                      <span className="font-semibold text-slate-200">3 actions exécutées</span>
                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          isActionsExpanded ? 'rotate-180' : 'rotate-0'
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {isActionsExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-[#14171d] border border-slate-800/80 text-xs font-mono space-y-2 text-slate-300">
                        <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                          <span>Action</span>
                          <span>Statut</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Analyse de la demande & architecture</span>
                          <span className="text-emerald-400 font-bold">✔ Terminé</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Génération du code source React</span>
                          <span className="text-emerald-400 font-bold">✔ Terminé</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Vérification de la compilation TypeScript</span>
                          <span className="text-emerald-400 font-bold">✔ Validé</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main Response Markdown / Text Content */}
                  <div className="w-full text-slate-100 text-sm md:text-[15px] leading-relaxed space-y-3 font-normal">
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Rich Table (Matching Image with Dossier & Statut columns) */}
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-[#161920]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#1c202a] text-slate-300 uppercase tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="px-4 py-2.5">Composant / Dossier</th>
                            <th className="px-4 py-2.5 text-center">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {[
                            { name: 'src/components/Header.tsx', status: '✔' },
                            { name: 'src/components/Sidebar.tsx', status: '✔' },
                            { name: 'src/App.tsx', status: '✔' },
                            { name: 'package.json', status: '✔' },
                          ].map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-2 text-slate-200">{item.name}</td>
                              <td className="px-4 py-2 text-center text-emerald-400 font-bold">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/30">
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 my-4 p-3 rounded-xl bg-[#161920] border border-slate-800 text-xs text-amber-300 font-mono animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Agent Delmas réfléchit et génère le code...</span>
              </div>
            )}
          </div>

          {/* Small compact Arrow Button on the right edge to scroll to bottom */}
          {showScrollToLatest && (
            <button
              type="button"
              onClick={scrollToBottom}
              className="absolute bottom-32 right-4 md:right-6 z-20 w-9 h-9 rounded-full bg-[#1e2430]/90 hover:bg-[#283244] text-slate-200 hover:text-white flex items-center justify-center shadow-xl border border-slate-700/80 transition-all active:scale-95 group"
              title="Défiler vers le bas"
              aria-label="Défiler vers le bas"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-y-0.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
          )}

          {/* 3. INTERACTIVE AGENT INPUT BOX (Glued directly onto bottom buttons) */}
          <div className="bg-[#121418] border-t border-slate-800/80 px-3 pt-2 pb-2 shrink-0 z-10">
            <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto">
              {/* Maximum 10 files alert notification */}
              {showMaxError && (
                <div className="mb-2 p-2.5 bg-amber-500/10 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs text-amber-300 shadow-md transition-all">
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

              <div className="bg-[#181b22] border border-slate-700/70 focus-within:border-amber-500/60 rounded-xl p-2.5 shadow-lg transition-all flex flex-col gap-2">
                {/* Attached file thumbnail banner */}
                {currentFiles.length > 0 && (
                  <div className="pb-1 px-1 flex flex-row items-center gap-2.5 overflow-x-auto custom-scrollbar">
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
                        onClick={() => triggerFileSelect(fileInputRef)}
                        className="w-28 h-16 rounded-full border-2 border-dashed border-slate-600 hover:border-amber-500 bg-[#161d28]/60 flex flex-col items-center justify-center shrink-0 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer my-1"
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

                {/* Textarea input */}
                <textarea
                  rows={3}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Décrivez votre projet web ou application..."
                  className="w-full bg-transparent text-sm md:text-base text-slate-100 placeholder-slate-500 resize-none focus:outline-none px-3 py-2.5 min-h-[70px] max-h-[180px] custom-scrollbar"
                />

                {/* Bottom Input Action Controls Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  {/* Left Controls: +, Plan */}
                  <div className="flex items-center gap-2">
                    {/* File Upload Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => triggerFileSelect(fileInputRef)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Ajouter un fichier"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>

                    {/* Plan Mode Toggle Checkbox/Pill */}
                    <button
                      type="button"
                      onClick={() => setPlanMode(!planMode)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        planMode
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded border flex items-center justify-center text-[10px] ${
                        planMode ? 'bg-amber-400 border-amber-400 text-slate-900 font-bold' : 'border-slate-500'
                      }`}>
                        {planMode && '✓'}
                      </span>
                      <span>Plan</span>
                    </button>
                  </div>

                  {/* Right Controls: Mic & Send Arrow */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isVoiceRecording
                          ? 'bg-red-500/20 text-red-400 animate-pulse'
                          : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      title="Dictée vocale"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                    </button>

                    <button
                      type="submit"
                      disabled={!inputMessage.trim() && currentFiles.length === 0}
                      className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-bold transition-all active:scale-95 shadow-lg"
                      title="Envoyer à Agent Delmas"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SPLIT PANEL (Preview / Code Viewer / Terminal) */}
        {(activeTab === 'preview' || activeTab === 'code' || activeTab === 'terminal' || activeTab === 'split') && (
          <div className="w-1/2 bg-[#0e1014] border-l border-slate-800 flex flex-col overflow-hidden">
            {/* Header Tabs for Right Panel */}
            <div className="h-10 px-3 bg-[#16181f] border-b border-slate-800 flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'preview' || activeTab === 'split'
                      ? 'bg-slate-800 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🖥️ Aperçu App
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'code' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📄 Fichiers Code
                </button>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'terminal' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  &gt;_ Terminal
                </button>
              </div>

              <button
                onClick={() => setActiveTab('agent')}
                className="text-slate-500 hover:text-slate-300 p-1"
                title="Fermer le panneau droit"
              >
                ✕
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              {activeTab === 'code' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex gap-2 border-b border-slate-800 pb-2">
                    {Object.keys(mockFiles).map((fileName) => (
                      <button
                        key={fileName}
                        onClick={() => setSelectedCodeFile(fileName)}
                        className={`px-2.5 py-1 rounded ${
                          selectedCodeFile === fileName
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {fileName}
                      </button>
                    ))}
                  </div>
                  <pre className="p-3 rounded-lg bg-[#14161d] text-slate-200 border border-slate-800 overflow-x-auto">
                    <code>{mockFiles[selectedCodeFile]}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'terminal' && (
                <div className="font-mono text-xs space-y-1 text-slate-300 bg-[#0a0c0f] p-4 rounded-xl border border-slate-800 h-full">
                  <p className="text-emerald-400">$ npm run build</p>
                  <p className="text-slate-400">&gt; react-example@0.0.0 build</p>
                  <p className="text-slate-400">&gt; vite build</p>
                  <p className="text-slate-300">vite v5.4.11 building for production...</p>
                  <p className="text-slate-300">✓ 42 modules transformed.</p>
                  <p className="text-emerald-400">dist/index.html    0.48 kB │ gzip:  0.31 kB</p>
                  <p className="text-emerald-400">dist/assets/index.js 142.30 kB │ gzip: 45.20 kB</p>
                  <p className="text-emerald-400">✓ built in 1.12s</p>
                </div>
              )}

              {(activeTab === 'preview' || activeTab === 'split') && (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">Aperçu en direct de l'application</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    L'application s'exécute en temps réel. Toutes vos demandes en langage naturel génèrent et mettent à jour le rendu instantanément.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM WORKSPACE NAVIGATION TOOLBAR (Matching Dock Bar from Image) */}
      <footer className="h-12 px-4 bg-[#181a20] border-t border-slate-800/80 flex items-center justify-center gap-2 md:gap-4 shrink-0 z-20 text-slate-400">
        {[
          { id: 'terminal', icon: 'M4 17l6-6-6-6M12 19h8', label: 'Terminal' },
          { id: 'preview', icon: 'M2 3h20v14H2zM8 21h8M12 17v4', label: 'Aperçu' },
          { id: 'agent', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', label: 'Agent' },
          { id: 'code', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', label: 'Fichiers' },
          { id: 'split', icon: 'M3 3h18v18H3zM12 3v18', label: 'Vue Scindée' },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </footer>
    </div>
  );
}
