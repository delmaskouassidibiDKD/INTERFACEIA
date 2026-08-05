import React, { useState, useRef } from 'react';
import { Search, ChevronDown, ChevronRight, Plus, Menu } from 'lucide-react';
import { BlueRobot } from './BlueRobot';
import { DelmasRobot } from './DelmasRobot';

interface AgentsHubProps {
  onOpenChat: (agentName?: string, options?: { webSearch?: boolean; imageMode?: boolean }) => void;
  onOpenConstructeur: () => void;
  onOpenMenu?: () => void;
}

export default function AgentsHub({ onOpenChat, onOpenConstructeur, onOpenMenu }: AgentsHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDefaultListOpen, setIsDefaultListOpen] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      } else {
        setSearchQuery('');
      }
      return nextState;
    });
  };

  const defaultAgents = [
    {
      num: 1,
      id: 'web-agent',
      name: 'Assistant Recherche Web',
      subtitle: "Recherche et exploration d'actualités et données en temps réel",
      badge: 'Recherche Web',
      action: () => onOpenChat('Recherche Web', { webSearch: true }),
    },
    {
      num: 2,
      id: 'image-agent',
      name: "Générateur d'Images",
      subtitle: "Création et retouche de visuels et illustrations IA haute qualité",
      badge: 'Créatif',
      action: () => onOpenChat("Générateur d'images", { imageMode: true }),
    },
    {
      num: 3,
      id: 'code-agent',
      name: 'Assistant Code & Dev',
      subtitle: 'Développement, débogage et génération de code TypeScript & React',
      badge: 'Dev',
      action: () => onOpenChat('Code & Dev'),
    },
    {
      num: 4,
      id: 'redaction-agent',
      name: 'Assistant Rédaction & Copywriting',
      subtitle: 'Rédaction d’articles, emails et contenus captivants',
      badge: 'Rédaction',
      action: () => onOpenChat('Assistant Rédaction'),
    },
    {
      num: 5,
      id: 'traduction-agent',
      name: 'Expert Traduction',
      subtitle: 'Traduction fluide et fidèle en plus de 30 langues',
      badge: 'Langues',
      action: () => onOpenChat('Expert Traduction'),
    },
    {
      num: 6,
      id: 'productivity-agent',
      name: 'Coach Productivité',
      subtitle: 'Planification, gestion du temps et organisation de projets',
      badge: 'Organisation',
      action: () => onOpenChat('Coach Productivité'),
    },
    {
      num: 7,
      id: 'data-agent',
      name: 'Analytique & Data',
      subtitle: 'Analyse de données, statistiques et interprétation de tableaux',
      badge: 'Data',
      action: () => onOpenChat('Analytique & Data'),
    },
    {
      num: 8,
      id: 'pdf-agent',
      name: 'Synthèse & Analyse PDF',
      subtitle: 'Lecture rapide, résumés et extraction d’informations clés',
      badge: 'Documents',
      action: () => onOpenChat('Synthèse PDF'),
    },
    {
      num: 9,
      id: 'marketing-agent',
      name: 'Stratège Marketing',
      subtitle: 'Idées de campagnes, SEO et stratégies de croissance',
      badge: 'Marketing',
      action: () => onOpenChat('Stratège Marketing'),
    },
    {
      num: 10,
      id: 'math-agent',
      name: 'Assistant Sciences & Maths',
      subtitle: 'Résolution de formules, physique et algorithmes',
      badge: 'Sciences',
      action: () => onOpenChat('Sciences & Maths'),
    },
  ];

  const filteredAgents = defaultAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-screen bg-[#0b0f19] text-white flex flex-col select-none overflow-hidden">
      {/* 1. FIXED TOP HEADER BAR */}
      <div className="w-full h-14 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 shrink-0 z-30 flex items-center justify-between max-w-md mx-auto">
        {/* Left: Hamburger menu */}
        {onOpenMenu ? (
          <button
            onClick={onOpenMenu}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-800 active:scale-95 cursor-pointer shrink-0"
            title="Ouvrir le menu"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-4.5 h-4.5 text-white" />
          </button>
        ) : (
          <div className="w-8" />
        )}

        {/* Center Title */}
        <span className="font-bold text-base tracking-tight text-white">
          Agents Hub
        </span>

        {/* Right: Search / Loupe button */}
        <button
          onClick={toggleSearch}
          className={`p-2 rounded-xl transition-all border active:scale-95 cursor-pointer shrink-0 ${
            isSearchOpen || searchQuery
              ? 'text-white bg-slate-800 border-slate-700'
              : 'text-zinc-300 bg-transparent hover:bg-slate-800/80 border-slate-800'
          }`}
          title="Rechercher"
          aria-label="Rechercher des agents"
        >
          <Search className="w-4.5 h-4.5 text-white" />
        </button>
      </div>

      {/* 2. FIXED PINNED TOP SECTION (Main Agent, Custom Agent Button & Section Header) */}
      {!searchQuery && (
        <div className="w-full max-w-md mx-auto px-4 pt-3 pb-1 shrink-0 z-20">
          <button
            onClick={() => onOpenChat('Delmas AI')}
            className="w-full bg-[#131926] hover:bg-[#1a2234] border border-amber-500/30 hover:border-amber-500/50 rounded-2xl py-2.5 px-3 flex items-center gap-3 text-left transition-all group active:scale-[0.99] cursor-pointer shadow-sm"
          >
            {/* Special Delmas Animated Robot with DNA logo on belly */}
            <div className="relative shrink-0 w-[52px] h-[52px] rounded-xl bg-slate-900/90 border border-amber-500/40 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(224,134,54,0.3)]">
              <DelmasRobot className="w-[46px] h-[46px]" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#131926]" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="font-bold text-sm text-white truncate block">
                Delmas AI
              </span>
            </div>

            <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Small button right below main agent */}
          <button
            onClick={onOpenConstructeur}
            className="mt-2 w-full bg-[#151c2c] hover:bg-[#1e273d] border border-slate-800/80 text-zinc-300 hover:text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-400" />
            <span>Créer un assistant personnalisé</span>
          </button>

          {/* Fixed Section Title "Liste des Assistants" */}
          <div className="mt-3.5 flex items-center justify-between px-0.5 shrink-0">
            <button
              onClick={() => setIsDefaultListOpen(!isDefaultListOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors py-1 cursor-pointer"
            >
              <span>Liste des Assistants</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                  isDefaultListOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>
            <span className="text-[11px] text-zinc-400 font-mono">
              {filteredAgents.length} disponibles
            </span>
          </div>
        </div>
      )}

      {/* Toggleable Search Bar */}
      {(isSearchOpen || searchQuery) && (
        <div className="w-full max-w-md mx-auto px-4 pt-2 pb-1 shrink-0">
          <div className="relative animate-fade-in">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des assistants..."
              className="w-full bg-[#131926] text-sm text-white placeholder-zinc-500 pl-9 pr-3 py-2 rounded-xl border border-slate-800/80 focus:outline-none focus:border-slate-600 transition-colors"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* 3. SCROLLABLE AGENTS LIST CONTAINER */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col px-4 pt-1 pb-14 overflow-y-auto scrollbar-none custom-scrollbar">
        {/* Agents List - Only this list scrolls underneath */}
        {isDefaultListOpen && (
          <div className="space-y-2 pb-6">
            {filteredAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={agent.action}
                className="w-full bg-[#131926] hover:bg-[#1a2234] border border-slate-800/90 rounded-xl p-3 flex items-center gap-3 text-left transition-all active:scale-[0.99] cursor-pointer group shadow-sm"
              >
                {/* Small discrete number tag (1, 2, 3...) */}
                <div className="w-5 h-5 rounded bg-slate-800/90 border border-slate-700/60 text-[10px] font-mono text-zinc-300 flex items-center justify-center shrink-0">
                  {agent.num}
                </div>

                {/* Blue Animated Robot Icon */}
                <div className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0 p-1">
                  <BlueRobot className="w-7 h-7" />
                </div>

                {/* Text Details - Only Name */}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-xs sm:text-sm text-white truncate block">
                    {agent.name}
                  </span>
                </div>

                {/* Right chevron */}
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}

            {filteredAgents.length === 0 && (
              <div className="text-center py-6 text-xs text-zinc-400">
                Aucun assistant ne correspond à "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

