import React from 'react';

interface HeaderProps {
  onOpenMenu: () => void;
  onNewChat: () => void;
  onOpenConstructeur?: () => void;
  onExitConstructeur?: () => void;
  onBackToHub?: () => void;
  isConstructeurMode?: boolean;
}

export default function Header({
  onOpenMenu,
  onNewChat,
  onOpenConstructeur,
  onExitConstructeur,
  onBackToHub,
  isConstructeurMode = false,
}: HeaderProps) {
  if (isConstructeurMode) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 h-9 bg-[#0a0c10]/95 backdrop-blur-md border-b border-slate-800/70 pointer-events-auto">
        {/* Top Left: Menu button */}
        <div className="flex items-center">
          <button
            onClick={onOpenMenu}
            className="p-1 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 active:scale-95 transition-all border border-amber-500/20"
            aria-label="Menu Constructeur"
            title="Menu Constructeur"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Centered Agent Delmas Title */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
          <span className="font-semibold text-xs md:text-sm text-white tracking-tight">
            Agent <span className="text-amber-300 font-bold">Delmas</span>
          </span>
        </div>

        {/* Top Right: Back to Chats Hub */}
        <button
          onClick={() => {
            if (onExitConstructeur) {
              onExitConstructeur();
            } else if (onBackToHub) {
              onBackToHub();
            } else if (onNewChat) {
              onNewChat();
            }
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0d1827]/90 hover:bg-[#15243a] border border-slate-700/60 text-slate-300 hover:text-white active:scale-95 transition-all text-[11px] font-medium shadow-md backdrop-blur-md group"
          aria-label="Retour à l'accueil Chats"
          title="Retour à l'accueil Chats"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Chats</span>
        </button>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 h-9 bg-[#0a0c10]/95 backdrop-blur-md border-b border-slate-800/70 pointer-events-auto">
      {/* Top Left: 3-line menu button & App Name with DNA Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMenu}
          className="p-1.5 rounded-lg text-[#5a7a94] hover:text-[#00d4aa] hover:bg-[rgba(0,212,170,0.12)] active:scale-95 transition-all"
          aria-label="Menu"
          title="Menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-lg text-white tracking-tight">
            Delmas
          </span>
        </div>
      </div>

      {/* Top Right: New Chat button + Back button behind it */}
      <div className="flex items-center gap-2">
        {/* Message bubble with Plus sign button for New Chat */}
        <button
          onClick={onNewChat}
          className="p-2 rounded-xl text-[#5a7a94] hover:text-[#00d4aa] hover:bg-[rgba(0,212,170,0.12)] active:scale-95 transition-all flex items-center justify-center"
          aria-label="Nouvelle conversation"
          title="Nouvelle conversation"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Message speech bubble */}
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            {/* Plus sign inside message bubble */}
            <line x1="12" y1="8" x2="12" y2="14" />
            <line x1="9" y1="11" x2="15" y2="11" />
          </svg>
        </button>

        {/* Back button to Chats Hub placed directly behind/after the new chat button */}
        {onBackToHub && (
          <button
            onClick={onBackToHub}
            className="ml-2 w-7 h-7 p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all border border-slate-800/80 bg-black/50 backdrop-blur-md flex items-center justify-center font-medium shrink-0"
            aria-label="Retour à l'accueil Chats"
            title="Retour à l'accueil Chats"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
