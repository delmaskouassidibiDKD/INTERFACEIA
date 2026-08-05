import React from 'react';
import { MessageSquare, User } from 'lucide-react';
import { BlueRobot } from './BlueRobot';

interface BottomNavProps {
  activeTab: 'hub' | 'chat' | 'constructeur' | 'profile';
  onSelectTab: (tab: 'hub' | 'chat' | 'constructeur' | 'profile') => void;
}

export default function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const isDiscusActive = activeTab === 'hub' || activeTab === 'chat';
  const isConstructeurActive = activeTab === 'constructeur';
  const isProfileActive = activeTab === 'profile';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-1.5 h-14 flex items-center justify-around select-none">
      {/* Tab 1: Chats (Hub / Chat) */}
      <button
        type="button"
        onClick={() => onSelectTab('hub')}
        className={`flex flex-col items-center justify-center py-0.5 px-3 transition-colors ${
          isDiscusActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <MessageSquare className="w-5 h-5 mb-0.5" strokeWidth={isDiscusActive ? 2.2 : 1.8} />
        <span className="text-[10px] tracking-tight font-medium">Chats</span>
      </button>

      {/* Tab 2: Agent Delmas (Constructeur) */}
      <button
        type="button"
        onClick={() => onSelectTab('constructeur')}
        className={`flex flex-col items-center justify-center py-0.5 px-3 transition-colors group ${
          isConstructeurActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <div className={`w-5 h-5 mb-0.5 rounded-full flex items-center justify-center p-0.5 transition-transform ${isConstructeurActive ? 'scale-110 ring-1 ring-blue-400' : ''}`}>
          <BlueRobot className="w-full h-full" />
        </div>
        <span className="text-[10px] tracking-tight font-medium">Agent Delmas</span>
      </button>

      {/* Tab 3: Profil */}
      <button
        type="button"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center py-0.5 px-3 transition-colors ${
          isProfileActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" strokeWidth={isProfileActive ? 2.2 : 1.8} />
        <span className="text-[10px] tracking-tight font-medium">Profil</span>
      </button>
    </nav>
  );
}
