import React from 'react';
import { Settings, User, Mail, ShieldCheck, Sliders, Globe, Image as ImageIcon, Trash2, Info, ArrowRight, ExternalLink } from 'lucide-react';

interface ProfileViewProps {
  onOpenSettings: () => void;
  webSearch: boolean;
  setWebSearch: (val: boolean) => void;
  imageMode: boolean;
  setImageMode: (val: boolean) => void;
  onClearHistory: () => void;
  systemInstruction: string;
}

export default function ProfileView({
  onOpenSettings,
  webSearch,
  setWebSearch,
  imageMode,
  setImageMode,
  onClearHistory,
  systemInstruction,
}: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col pt-6 pb-24 px-4 max-w-md mx-auto select-none">
      {/* Title */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h1 className="text-xl font-bold tracking-tight text-white">Mon Profil</h1>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          title="Paramètres"
        >
          <Settings className="w-5 h-5 text-amber-400" />
        </button>
      </div>

      {/* Main User Account Card */}
      <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl p-4 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shrink-0 shadow-lg shadow-amber-950/30">
            <div className="w-full h-full bg-[#141418] rounded-full flex items-center justify-center font-bold text-lg text-amber-300">
              DK
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg text-white truncate">dkd509796</h2>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                Pro
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 truncate">
              <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">dkd509796@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Quick status banner */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Compte vérifié</span>
          </div>
          <span className="text-zinc-500 font-mono">ID: #89201</span>
        </div>
      </div>

      {/* Settings Action Button */}
      <div className="mb-6">
        <button
          onClick={onOpenSettings}
          className="w-full bg-[#121215] hover:bg-[#1a1a1f] border border-amber-500/30 hover:border-amber-500/60 text-amber-300 font-medium py-3 px-4 rounded-xl flex items-center justify-between text-sm transition-all shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Settings className="w-4 h-4" />
            </div>
            <span>Paramètres de l'application</span>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Preferences Section */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
          Préférences Rapides
        </h3>

        <div className="bg-[#0a0a0c] border border-zinc-800/80 rounded-xl divide-y divide-zinc-800/60 overflow-hidden">
          {/* Web Search Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">Recherche Web</p>
                <p className="text-xs text-zinc-500">Autoriser les données en temps réel</p>
              </div>
            </div>
            <button
              onClick={() => setWebSearch(!webSearch)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                webSearch ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  webSearch ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Image Mode Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">Mode Générateur d'Image</p>
                <p className="text-xs text-zinc-500">Activer les requêtes de génération visuelle</p>
              </div>
            </div>
            <button
              onClick={() => setImageMode(!imageMode)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                imageMode ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  imageMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Management & System */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
          Gestion & Actions
        </h3>

        <div className="bg-[#0a0a0c] border border-zinc-800/80 rounded-xl divide-y divide-zinc-800/60 overflow-hidden">
          {/* System Instructions Preview */}
          <button
            onClick={onOpenSettings}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">Instructions Système</p>
                <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                  {systemInstruction || 'Delmas Assistant'}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-500" />
          </button>

          {/* Clear History */}
          <button
            onClick={onClearHistory}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-red-500/10 transition-colors text-red-400"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">Effacer la conversation</p>
                <p className="text-xs text-red-400/70">Réinitialiser l'historique actif</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* App Version Footer */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-500">
          <Info className="w-3.5 h-3.5 text-zinc-400" />
          <span>v1.2.0 • Delmas AI Hub</span>
        </div>
      </div>
    </div>
  );
}
