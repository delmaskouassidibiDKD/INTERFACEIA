import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DnaLogo } from './DnaLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (title: string, projectId?: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenSearch?: () => void;
  activeChatTitle: string | null;
  isConstructeurMode?: boolean;
  onOpenConstructeur?: () => void;
  onExitConstructeur?: () => void;
  constructeurProjects?: ChatItem[];
}

interface ChatItem {
  id: string;
  title: string;
  isPinned?: boolean;
}

export default function Sidebar({
  isOpen,
  onClose,
  onSelectChat,
  onNewChat,
  onOpenSettings,
  onOpenSearch,
  activeChatTitle,
  isConstructeurMode = false,
  onOpenConstructeur,
  onExitConstructeur,
  constructeurProjects: propConstructeurProjects,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isPinnedCollapsed, setIsPinnedCollapsed] = useState(false);

  // Constructeur Projects List
  const defaultConstructeurProjects: ChatItem[] = [
    { id: 'cp1', title: 'Site Web Vitrine React & Tailwind' },
    { id: 'cp2', title: 'Application E-Commerce Fullstack' },
    { id: 'cp3', title: 'API REST Express Server Node.js' },
    { id: 'cp4', title: 'Dashboard SaaS Admin UI' },
    { id: 'cp5', title: 'Composant Animé UI Motion' },
  ];

  const constructeurProjects = propConstructeurProjects || defaultConstructeurProjects;

  // Chat Mode List
  const [pinnedItems] = useState<ChatItem[]>([
    { id: 'p1', title: 'DKD-VEGA : Accès aux informations du té...', isPinned: true },
    { id: 'p2', title: "Structurer sa base de données d'applicati...", isPinned: true },
    { id: 'p3', title: 'Application Bugs: Causes et Solutions', isPinned: true },
    { id: 'p4', title: "Auto-hébergement d'applications et sites...", isPinned: true },
    { id: 'p5', title: 'Calculs transformateur triphasé : Phase v...', isPinned: true },
    { id: 'p6', title: 'DKD-Cliptok : Design et Fonctionnalités', isPinned: true },
    { id: 'p7', title: 'Pourquoi TikTok Paie Ses Créateurs', isPinned: true },
    { id: 'p8', title: "Conception d'une application hybride co...", isPinned: true },
  ]);

  const [recentItems] = useState<ChatItem[]>([
    { id: 'r1', title: '10$ en FCFA' },
    { id: 'r2', title: 'Réseaux sociaux UI' },
    { id: 'r3', title: "Création d'avatars 3D" },
    { id: 'r4', title: 'Sites UI 3D interactifs' },
  ]);

  const filterItems = (items: ChatItem[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleItemClick = (title: string, projectId?: string) => {
    onSelectChat(title, projectId);
    onClose();
  };

  const handleNewChatClick = () => {
    if (isConstructeurMode && onOpenConstructeur) {
      onOpenConstructeur();
    } else {
      onNewChat();
    }
    onClose();
  };

  const filteredConstructeur = filterItems(constructeurProjects);
  const filteredPinned = filterItems(pinnedItems);
  const filteredRecent = filterItems(recentItems);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          />

          {/* Left Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-[290px] max-w-[85vw] bg-[#08101a] border-r border-[rgba(0,212,170,0.12)] shadow-2xl flex flex-col text-slate-200"
          >
            {/* Header Area */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.06)]">
              {isConstructeurMode ? (
                <div className="flex items-center gap-2">
                  <DnaLogo className="w-5 h-5 shrink-0 text-amber-400" glow />
                  <span className="font-semibold text-lg text-white tracking-tight">
                    Agent Delmas
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DnaLogo className="w-5 h-5 shrink-0" glow />
                  <span className="font-semibold text-lg text-white tracking-tight">
                    Delmas
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1">
                {/* Search Toggle Button */}
                <button
                  onClick={() => setIsSearching(!isSearching)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSearching
                      ? isConstructeurMode
                        ? 'text-amber-300 bg-amber-500/15'
                        : 'text-[#00d4aa] bg-[rgba(0,212,170,0.12)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  aria-label="Rechercher"
                  title="Rechercher"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>

                {/* Close Drawer Button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                  aria-label="Fermer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Input Bar (Expandable) */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pt-3 overflow-hidden"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        isConstructeurMode
                          ? 'Rechercher des projets web/app...'
                          : 'Rechercher des conversations...'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-[#111e2f] text-sm text-slate-100 placeholder-slate-500 rounded-lg pl-8 pr-3 py-2 border border-slate-700/60 focus:outline-none ${
                        isConstructeurMode ? 'focus:border-amber-400' : 'focus:border-[#00d4aa]'
                      }`}
                      autoFocus
                    />
                    <svg
                      className="absolute left-2.5 top-2.5 text-slate-500"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Body */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
              {isConstructeurMode ? (
                /* ===================================================================== */
                /* CONSTRUCTEUR MODE SIDEBAR MENU                                        */
                /* ===================================================================== */
                <>
                  {/* Action: New Constructeur Project */}
                  <div>
                    <button
                      onClick={handleNewChatClick}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/35 text-amber-300 font-semibold text-xs transition-all active:scale-[0.98] shadow-[0_0_12px_rgba(255,180,0,0.15)]"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>Nouveau Projet</span>
                    </button>
                  </div>

                  {/* Section: Vos Projets */}
                  {filteredConstructeur.length > 0 && (
                    <div>
                      <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                        <span>📁 Vos Projets</span>
                      </h3>
                      <div className="space-y-1">
                        {filteredConstructeur.map((item) => {
                          const isActive = activeChatTitle === item.title;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item.title, item.id)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left group ${
                                isActive
                                  ? 'bg-amber-500/15 text-amber-300 font-medium border border-amber-500/30'
                                  : 'text-slate-300 hover:text-white hover:bg-[#122238]'
                              }`}
                            >
                              <svg
                                className={`shrink-0 transition-transform ${
                                  isActive ? 'text-amber-300 scale-110' : 'text-slate-500 group-hover:text-amber-400'
                                }`}
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                              </svg>
                              <span className="truncate text-[13.5px]">{item.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ===================================================================== */
                /* STANDARD CHAT MODE SIDEBAR MENU                                       */
                /* ===================================================================== */
                <>
                  {/* New Conversation Button */}
                  <div>
                    <button
                      onClick={handleNewChatClick}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[rgba(0,212,170,0.12)] hover:bg-[rgba(0,212,170,0.2)] border border-[rgba(0,212,170,0.25)] text-[#00d4aa] font-medium text-xs transition-all active:scale-[0.98]"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>Nouvelle conversation</span>
                    </button>
                  </div>

                  {/* Library Option */}
                  <div>
                    <button
                      onClick={() => {
                        handleItemClick('Bibliothèque');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-[#122238] transition-all text-sm font-medium group"
                    >
                      <svg
                        className="text-[#00d4aa] group-hover:scale-110 transition-transform"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      </svg>
                      <span>Bibliothèque</span>
                    </button>
                  </div>

                  {/* Éléments épinglés Section */}
                  {filteredPinned.length > 0 && (
                    <div>
                      <button
                        onClick={() => setIsPinnedCollapsed(!isPinnedCollapsed)}
                        className="w-full flex items-center justify-between px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-1.5 transition-colors group"
                        title={isPinnedCollapsed ? 'Dérouler les éléments épinglés' : 'Plier les éléments épinglés'}
                      >
                        <div className="flex items-center gap-1.5">
                          <svg
                            className={`transition-transform duration-200 text-slate-400 group-hover:text-slate-200 ${
                              isPinnedCollapsed ? '-rotate-90' : 'rotate-0'
                            }`}
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                          <span>Éléments épinglés</span>
                        </div>
                        <span className="text-[10px] bg-slate-800/80 text-slate-400 group-hover:text-slate-300 px-1.5 py-0.5 rounded-full font-medium">
                          {filteredPinned.length}
                        </span>
                      </button>

                      {!isPinnedCollapsed && (
                        <div className="space-y-1">
                          {filteredPinned.map((item) => {
                            const isActive = activeChatTitle === item.title;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleItemClick(item.title)}
                                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left group ${
                                  isActive
                                    ? 'bg-[#122b3b] text-[#00d4aa] font-medium border border-[rgba(0,212,170,0.25)]'
                                    : 'text-slate-200 hover:text-white hover:bg-[#122238]'
                                }`}
                              >
                                <span className="truncate flex-1 font-normal text-[13.5px] leading-snug">
                                  {item.title}
                                </span>
                                <svg
                                  className={`shrink-0 transition-colors ${
                                    isActive ? 'text-[#00d4aa]' : 'text-slate-400 group-hover:text-slate-200'
                                  }`}
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="12" y1="17" x2="12" y2="22" />
                                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 4 15.24V17z" />
                                </svg>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Récents Section */}
                  {filteredRecent.length > 0 && (
                    <div>
                      <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Récents
                      </h3>
                      <div className="space-y-1">
                        {filteredRecent.map((item) => {
                          const isActive = activeChatTitle === item.title;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item.title)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                                isActive
                                  ? 'bg-[#122b3b] text-[#00d4aa] font-medium border border-[rgba(0,212,170,0.25)]'
                                  : 'text-slate-300 hover:text-white hover:bg-[#122238]'
                              }`}
                            >
                              <svg
                                className={`shrink-0 ${
                                  isActive ? 'text-[#00d4aa]' : 'text-slate-400'
                                }`}
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              <span className="truncate">{item.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
