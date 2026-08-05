import React, { useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (title: string) => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  snippet: string;
  type: 'discussion' | 'image' | 'document';
  category?: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelectChat,
}: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<'tous' | 'discussions' | 'images' | 'documents'>('tous');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Sample data directly mirroring the user's provided screenshot
  const searchItems: SearchResultItem[] = [
    {
      id: '1',
      title: '10$ en FCFA',
      snippet: '...Le taux varie légèrement selon les banques et le marché informel...',
      type: 'discussion',
    },
    {
      id: '2',
      title: 'Réseaux sociaux UI',
      snippet: '...pour les développeurs qui veulent créer des interfaces fluides...',
      type: 'discussion',
    },
    {
      id: '3',
      title: "Création d'avatars 3D",
      snippet: '...propre **VPS**, tu auras beaucoup plus de liberté pour compiler...',
      type: 'discussion',
    },
    {
      id: '4',
      title: 'Sites UI 3D interactifs',
      snippet: '...sur un site, voici les meilleurs frameworks Three.js et WebGL...',
      type: 'discussion',
    },
    {
      id: '5',
      title: 'Analyse probabilité BTS ELT',
      snippet: '...fréquence observée | calcul des probabilités conditionnelles...',
      type: 'discussion',
    },
    {
      id: '6',
      title: 'VPS IA Backend Guide',
      snippet: '...mieux ta vision. En réalité, **DKD ClipTok n\'est pas** hébergé sur...',
      type: 'discussion',
    },
    {
      id: '7',
      title: 'Problème schéma Circuit 1',
      snippet: '...calcul de \\(V_E^+\\), dates \\(t_1\\), \\(t_2\\), expression de la tension...',
      type: 'discussion',
    },
    {
      id: '8',
      title: 'C\'est quoi CoQ10',
      snippet: '...nourrir et développer ton corps**, la CoQ10 n\'est **pas un produit stéroïde**...',
      type: 'discussion',
    },
    {
      id: '9',
      title: 'API pour afficher produits',
      snippet: 'Voici un modèle d\'email professionnel que tu peux envoyer aux fournisseurs...',
      type: 'discussion',
    },
    {
      id: '10',
      title: 'Numéro incomplet Côte d\'Ivoire',
      snippet: 'Format de numérotation à 10 chiffres en Côte d\'Ivoire (ex: +225 07 ...)',
      type: 'discussion',
    },
    {
      id: '11',
      title: 'Analyse cognitive et profil',
      snippet: 'Synthèse des performances et des méthodes de révision de l\'élève...',
      type: 'discussion',
    },
    {
      id: '12',
      title: 'DKDschool UI Mobile Screenshots',
      snippet: 'Maquettes de l\'application mobile DKDschool pour le collège et lycée',
      type: 'image',
    },
    {
      id: '13',
      title: 'Google Workspace Data Flow.png',
      snippet: 'Schéma d\'architecture des intégrations API Google Chat & Docs',
      type: 'image',
    },
    {
      id: '14',
      title: 'Cahier_Des_Charges_Aether.pdf',
      snippet: 'Spécifications techniques et modules d\'intelligence artificielle',
      type: 'document',
    },
  ];

  // Filtering based on active tab and search query
  const filteredItems = searchItems.filter((item) => {
    const matchesTab =
      activeTab === 'tous' ||
      (activeTab === 'discussions' && item.type === 'discussion') ||
      (activeTab === 'images' && item.type === 'image') ||
      (activeTab === 'documents' && item.type === 'document');

    const matchesQuery =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesQuery;
  });

  const handleSelectItem = (title: string) => {
    onSelectChat(title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-slate-100 flex flex-col overflow-hidden animate-fade-in font-sans">
      {/* Top Header Filter Bar (Exactly like screenshot: Tous, Discussions, Images, Documents) */}
      <div className="w-full bg-[#000000]/95 backdrop-blur-md pt-4 pb-3 px-4 border-b border-slate-900 shrink-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('tous')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
              activeTab === 'tous'
                ? 'bg-[#2c2c2e] text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Tous
          </button>

          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
              activeTab === 'discussions'
                ? 'bg-[#2c2c2e] text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Discussions
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
              activeTab === 'images'
                ? 'bg-[#2c2c2e] text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Images
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${
              activeTab === 'documents'
                ? 'bg-[#2c2c2e] text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      {/* Main Scrollable Results Canvas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto px-4 py-3 space-y-2 pb-32">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-sm font-medium">Aucun résultat trouvé pour cette recherche</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item.title)}
                className="group flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#1a1a1c] transition-colors cursor-pointer"
              >
                {/* Icon Box */}
                <div className="w-10 h-10 rounded-2xl bg-[#1c1c1e] border border-slate-800 flex items-center justify-center text-slate-200 shrink-0">
                  {item.type === 'discussion' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  )}
                  {item.type === 'image' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                  {item.type === 'document' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  )}
                </div>

                {/* Content Box */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-white truncate leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5 leading-normal">
                    {item.snippet}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fixed Bottom Floating Search Pill Bar (Exactly like user screenshot) */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2.5">
          {/* Main Search Input Pill */}
          <div className="flex-1 bg-[#222224] border border-slate-700/50 rounded-full px-4 py-3 flex items-center gap-3 shadow-2xl">
            <svg
              className="text-slate-400 shrink-0"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              autoFocus
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-slate-600/80 text-slate-200 flex items-center justify-center hover:bg-slate-500 transition-colors shrink-0"
                aria-label="Effacer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Close Button Circle (X) on the right */}
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-[#222224] border border-slate-700/50 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors shadow-2xl shrink-0"
            aria-label="Fermer la recherche"
            title="Fermer la recherche"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
