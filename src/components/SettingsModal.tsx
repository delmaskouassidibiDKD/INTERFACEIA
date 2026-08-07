import React, { useState } from 'react';

// ─── Shared settings type (persisted in App.tsx, passed as props) ─────────────
export interface SharedSettings {
  userName: string;
  theme: string;
  accentColor: string;
  language: string;
  memories: string[];
}

export const DEFAULT_SHARED_SETTINGS: SharedSettings = {
  userName: 'Dibi Delmas',
  theme: 'Système (par défaut)',
  accentColor: 'Par défaut',
  language: 'français',
  memories: [
    'Préfère les réponses directes et bien structurées',
    "Développeur d'applications web et mobile",
    'Langue principale : Français',
  ],
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Per-section state (isolated per section)
  systemInstruction: string;
  setSystemInstruction: (val: string) => void;
  webSearch: boolean;
  setWebSearch: (val: boolean) => void;
  imageMode: boolean;
  setImageMode: (val: boolean) => void;
  // Global shared state (same across all sections, persists on navigation)
  shared: SharedSettings;
  setShared: (val: SharedSettings) => void;
}

type SubView = 'main' | 'personnalisation' | 'memoire' | 'plugins' | 'theme' | 'color' | 'language';

export default function SettingsModal({
  isOpen,
  onClose,
  systemInstruction,
  setSystemInstruction,
  webSearch,
  setWebSearch,
  shared,
  setShared,
}: SettingsModalProps) {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newMemory, setNewMemory] = useState('');

  if (!isOpen) return null;

  // Helpers that update shared state
  const setUserName   = (v: string)   => setShared({ ...shared, userName: v });
  const setTheme      = (v: string)   => setShared({ ...shared, theme: v });
  const setAccentColor = (v: string)  => setShared({ ...shared, accentColor: v });
  const setLanguage   = (v: string)   => setShared({ ...shared, language: v });
  const setMemories   = (v: string[]) => setShared({ ...shared, memories: v });

  const { userName, theme, accentColor, language, memories } = shared;

  const handleClose = () => {
    setActiveSubView('main');
    onClose();
  };

  const handleAddMemory = () => {
    if (newMemory.trim()) {
      setMemories([...memories, newMemory.trim()]);
      setNewMemory('');
    }
  };

  const handleRemoveMemory = (index: number) => {
    setMemories(memories.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-30 bg-[#0a1628] text-slate-100 flex flex-col overflow-hidden animate-fade-in">
      {/* Top Fixed Header Bar */}
      <div className="w-full bg-[#0a1628]/95 backdrop-blur-md border-b border-slate-800/60 shrink-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3.5">
          <button
            onClick={() => {
              if (activeSubView !== 'main') {
                setActiveSubView('main');
              } else {
                handleClose();
              }
            }}
            className="w-10 h-10 rounded-full bg-slate-800/60 hover:bg-slate-700/80 flex items-center justify-center text-slate-200 transition-colors"
            aria-label="Retour"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <span className="text-base font-semibold text-white tracking-tight">
            {activeSubView === 'main' && 'Paramètres'}
            {activeSubView === 'personnalisation' && 'Personnalisation'}
            {activeSubView === 'memoire' && 'Mémoire'}
            {activeSubView === 'plugins' && 'Plug-ins'}
            {activeSubView === 'theme' && 'Thème'}
            {activeSubView === 'color' && "Couleur d'accentuation"}
            {activeSubView === 'language' && 'Langue'}
          </span>

          <div className="w-10" />
        </div>
      </div>

      {/* Main Page Content - Scrollable area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20">
        {/* MAIN VIEW */}
        {activeSubView === 'main' && (
          <>
            {/* User Profile Banner */}
            <div className="flex flex-col items-center justify-center pt-2 pb-6">
              <div className="relative group cursor-pointer" onClick={() => setIsEditingName(true)}>
                <div className="w-24 h-24 rounded-full bg-[#f59e0b] text-slate-950 flex items-center justify-center text-3xl font-bold shadow-xl">
                  DD
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0a1628] flex items-center justify-center text-slate-200 shadow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
              </div>

              {isEditingName ? (
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-slate-800 text-white font-bold text-center px-4 py-1.5 rounded-xl border border-[#00d4aa] focus:outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="text-xs bg-[#00d4aa] text-slate-950 font-bold px-3 py-2 rounded-xl"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <h2
                  onClick={() => setIsEditingName(true)}
                  className="mt-4 text-xl font-bold text-white tracking-tight cursor-pointer hover:text-[#00d4aa] transition-colors"
                >
                  {userName}
                </h2>
              )}
            </div>

            {/* SECTION: Mon Delmas */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                Mon Delmas
              </h3>

              <div className="bg-[#132033] border border-slate-800/80 rounded-[22px] overflow-hidden divide-y divide-slate-800/60">
                {/* Personnalisation */}
                <button
                  onClick={() => setActiveSubView('personnalisation')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-200">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                      </svg>
                    </div>
                    <span className="text-base font-medium text-slate-100">Personnalisation</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Mémoire */}
                <button
                  onClick={() => setActiveSubView('memoire')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-200">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <span className="text-base font-medium text-slate-100">Mémoire</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Plug-in */}
                <button
                  onClick={() => setActiveSubView('plugins')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-200">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </div>
                    <span className="text-base font-medium text-slate-100">Plug-in</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* SECTION: Apparence (Thème & Couleur) */}
            <div className="bg-[#132033] border border-slate-800/80 rounded-[22px] overflow-hidden divide-y divide-slate-800/60">
              {/* Thème */}
              <button
                onClick={() => setActiveSubView('theme')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-200 shrink-0 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-medium text-slate-100">Thème</span>
                    <span className="text-sm text-slate-400">{theme}</span>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Couleur d'accentuation */}
              <button
                onClick={() => setActiveSubView('color')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-200 shrink-0 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-medium text-slate-100">Couleur d'accentuation</span>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00d4aa]" />
                      <span>{accentColor}</span>
                    </div>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* SECTION: Langue */}
            <div className="bg-[#132033] border border-slate-800/80 rounded-[22px] overflow-hidden">
              <button
                onClick={() => setActiveSubView('language')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-base font-medium text-slate-100">Langue</span>
                  <span className="text-sm text-slate-400 capitalize">{language}</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* SECTION: Utilisation automatique */}
            <div className="space-y-2 pt-1">
              <h3 className="text-sm font-medium text-slate-300 px-1">
                Utilisation automatique
              </h3>

              <div className="bg-[#132033] border border-slate-800/80 rounded-[22px] p-4 flex items-center justify-between">
                <div className="flex flex-col pr-3">
                  <span className="text-base font-medium text-slate-100">
                    Recherche sur le Web
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Rechercher des infos en temps réel sur le Web.
                  </span>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => setWebSearch(!webSearch)}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                    webSearch ? 'bg-white' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-slate-950 transition-transform ${
                      webSearch ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        )}

        {/* SUBVIEW: PERSONNALISATION */}
        {activeSubView === 'personnalisation' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Instructions personnalisées transmises à l'IA pour qu'elle réponde selon vos attentes.
            </p>

            <textarea
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              rows={8}
              className="w-full p-4 bg-[#132033] border border-slate-800/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00d4aa] text-sm leading-relaxed resize-none"
              placeholder="Ex: Réponds toujours en français de manière concise, sans fioritures..."
            />

            <button
              onClick={() => setActiveSubView('main')}
              className="w-full py-3 bg-[#00d4aa] text-slate-950 font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Enregistrer
            </button>
          </div>
        )}

        {/* SUBVIEW: MÉMOIRE */}
        {activeSubView === 'memoire' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Consultez et gérez les détails que Delmas a retenus au fil de vos conversations.
            </p>

            <div className="space-y-2">
              {memories.map((mem, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#132033] border border-slate-800/80 rounded-2xl text-sm text-slate-200"
                >
                  <span>{mem}</span>
                  <button
                    onClick={() => handleRemoveMemory(index)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Ajouter un souvenir..."
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                className="flex-1 bg-[#132033] border border-slate-800/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4aa]"
              />
              <button
                onClick={handleAddMemory}
                className="px-5 py-3 bg-[#00d4aa] text-slate-950 font-bold rounded-2xl text-sm shrink-0"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        {/* SUBVIEW: PLUGINS */}
        {activeSubView === 'plugins' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400 mb-2">
              Extensions actives configurées pour votre assistant.
            </p>

            <div className="p-4 bg-[#132033] border border-slate-800/80 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-sm">Gemini 3.6 Flash Engine</div>
                <div className="text-xs text-slate-400 mt-0.5">Modèle de langage ultra rapide et multimodal</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] font-medium">Actif</span>
            </div>

            <div className="p-4 bg-[#132033] border border-slate-800/80 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-sm">Google Search Grounding</div>
                <div className="text-xs text-slate-400 mt-0.5">Recherche web en temps réel avec citations</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] font-medium">
                {webSearch ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        )}

        {/* SUBVIEW: THEME */}
        {activeSubView === 'theme' && (
          <div className="space-y-2">
            {['Système (par défaut)', 'Sombre', 'Clair'].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setTheme(option);
                  setActiveSubView('main');
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  theme === option
                    ? 'bg-[#182a3d] border-[#00d4aa] text-[#00d4aa] font-semibold'
                    : 'bg-[#132033] border-slate-800/80 text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{option}</span>
                {theme === option && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* SUBVIEW: COULEUR D'ACCENTUATION */}
        {activeSubView === 'color' && (
          <div className="space-y-2">
            {[
              { name: 'Par défaut', color: '#00d4aa' },
              { name: 'Bleu Électrique', color: '#00a3ff' },
              { name: 'Violet Néon', color: '#a855f7' },
              { name: 'Ambre Doré', color: '#f59e0b' },
            ].map((opt) => (
              <button
                key={opt.name}
                onClick={() => {
                  setAccentColor(opt.name);
                  setActiveSubView('main');
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  accentColor === opt.name
                    ? 'bg-[#182a3d] border-[#00d4aa] text-white font-semibold'
                    : 'bg-[#132033] border-slate-800/80 text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: opt.color }} />
                  <span>{opt.name}</span>
                </div>
                {accentColor === opt.name && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#00d4aa]">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* SUBVIEW: LANGUE */}
        {activeSubView === 'language' && (
          <div className="space-y-2">
            {['français', 'english', 'español', 'deutsch'].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setActiveSubView('main');
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left capitalize ${
                  language === lang
                    ? 'bg-[#182a3d] border-[#00d4aa] text-[#00d4aa] font-semibold'
                    : 'bg-[#132033] border-slate-800/80 text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{lang}</span>
                {language === lang && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}
