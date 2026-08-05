import React, { useState, useRef } from 'react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LibraryItem {
  id: string;
  type: 'image' | 'file' | 'folder';
  title: string;
  category: string;
  imageUrl?: string;
  bgGradient?: string;
  fileSize?: string;
  fileExt?: string;
  isFolder?: boolean;
  itemCount?: number;
  customRender?: React.ReactNode;
}

export default function LibraryModal({ isOpen, onClose }: LibraryModalProps) {
  const [activeTab, setActiveTab] = useState<'tous' | 'images' | 'fichiers'>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  // Menu & View mode states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isTrashView, setIsTrashView] = useState(false);

  // New folder modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Hidden File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial mock library items
  const [items, setItems] = useState<LibraryItem[]>([
    {
      id: '1',
      type: 'image',
      title: 'Profil Étudiant',
      category: 'Photos',
      customRender: (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-amber-700/30 to-amber-950/80 absolute inset-0" />
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-600/40 border-2 border-amber-400/60 flex items-center justify-center text-amber-200 font-bold text-xl relative z-10 shadow-lg">
            DKD
          </div>
          <span className="absolute bottom-2 left-3 text-[11px] font-medium text-amber-200/90 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
            Portrait ID
          </span>
        </div>
      ),
    },
    {
      id: '2',
      type: 'image',
      title: 'DKDschool Numérique Dashboard',
      category: 'Interface UI',
      customRender: (
        <div className="w-full h-full bg-[#0a111a] p-3 flex flex-col justify-between text-slate-200 text-xs font-sans">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[#00d4aa]">
              Organise tes cours & examens !
            </div>
            <div className="text-[8px] text-slate-400 line-clamp-2">
              DKDschool-numérique accompagne les élèves de la 6ème à la Terminale.
            </div>
          </div>
          <div className="space-y-1 my-1">
            <span className="text-[7px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full inline-block">
              ⭐ Rigueur & Excellence
            </span>
            <div className="grid grid-cols-2 gap-1 text-[8px]">
              <div className="bg-slate-800 p-1 rounded text-center">Collège</div>
              <div className="bg-slate-800 p-1 rounded text-center">Lycée</div>
            </div>
          </div>
          <div className="bg-[#00d4aa]/20 border border-[#00d4aa]/40 text-[#00d4aa] text-[9px] font-semibold py-1 px-2 rounded-lg text-center">
            Prêt pour tes révisions ?
          </div>
        </div>
      ),
    },
    {
      id: '3',
      type: 'image',
      title: 'Matières Scientifiques & Littéraires',
      category: 'Programme',
      customRender: (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-pink-950/40 p-3 flex flex-col justify-between text-slate-200">
          <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
            Matières Scientifiques
          </div>
          <div className="space-y-1 text-[8px]">
            <div className="bg-slate-800/80 p-1 rounded flex justify-between">
              <span>Mathématiques</span>
              <span>v</span>
            </div>
            <div className="bg-slate-800/80 p-1 rounded flex justify-between">
              <span>Physique - Chimie</span>
              <span>v</span>
            </div>
            <div className="bg-slate-800/80 p-1 rounded flex justify-between">
              <span>SVT</span>
              <span>v</span>
            </div>
          </div>
          <div className="text-[9px] font-bold text-pink-400 uppercase tracking-wider mt-1">
            Matières Littéraires
          </div>
        </div>
      ),
    },
    {
      id: '4',
      type: 'image',
      title: 'Modules 4ème et 3ème Brevet',
      category: 'Cours',
      customRender: (
        <div className="w-full h-full bg-[#0d1826] p-2.5 grid grid-cols-2 gap-1.5">
          <div className="bg-slate-800/80 rounded-xl p-1.5 flex flex-col justify-between text-[8px]">
            <span className="font-bold text-amber-400">Classe de 4ème</span>
            <span className="text-[7px] text-slate-400">L'année de la logique</span>
            <span className="text-[7px] text-[#00d4aa]">En route &rarr;</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-1.5 flex flex-col justify-between text-[8px]">
            <span className="font-bold text-cyan-400">Classe de 3ème</span>
            <span className="text-[7px] text-slate-400">Dernière ligne droite</span>
            <span className="text-[7px] text-[#00d4aa]">En route &rarr;</span>
          </div>
        </div>
      ),
    },
    {
      id: '5',
      type: 'image',
      title: 'Logo Brand co.com',
      category: 'Graphics',
      customRender: (
        <div className="w-full h-full bg-[#111822] flex flex-col items-center justify-center p-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter">
            co.com
          </span>
          <span className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">
            Digital Identity
          </span>
        </div>
      ),
    },
    {
      id: '6',
      type: 'image',
      title: 'Google Workspace & Cloud Flow Diagram',
      category: 'Diagrammes',
      customRender: (
        <div className="w-full h-full bg-[#080d14] p-2.5 flex flex-col justify-between font-mono text-[8px]">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-slate-800 pb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>UP THE DATA</span>
          </div>
          <div className="space-y-1 text-slate-300 text-[7px]">
            <div className="flex items-center gap-1">🟢 Google Chat</div>
            <div className="flex items-center gap-1">📄 Google Docs</div>
            <div className="flex items-center gap-1">📊 Google Sheets</div>
            <div className="flex items-center gap-1">📁 Google Drive</div>
          </div>
          <div className="text-[7px] text-slate-500 text-right">API Workflow</div>
        </div>
      ),
    },
    {
      id: '7',
      type: 'file',
      title: 'Rapport_Analyse_Cognitive.pdf',
      category: 'Documents',
      fileSize: '2.4 MB',
      fileExt: 'PDF',
      customRender: (
        <div className="w-full h-full bg-[#121c2b] p-3 flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="w-8 h-10 rounded bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xs">
              PDF
            </div>
            <span className="text-[9px] text-slate-400">2.4 MB</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 line-clamp-2">
              Rapport Analyse Cognitive.pdf
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">Mis à jour hier</div>
          </div>
        </div>
      ),
    },
    {
      id: '8',
      type: 'file',
      title: 'Cahier_Des_Charges_Aether.docx',
      category: 'Documents',
      fileSize: '1.1 MB',
      fileExt: 'DOCX',
      customRender: (
        <div className="w-full h-full bg-[#121c2b] p-3 flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="w-8 h-10 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              DOC
            </div>
            <span className="text-[9px] text-slate-400">1.1 MB</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 line-clamp-2">
              Cahier Des Charges Aether.docx
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">Mis à jour le 20/07</div>
          </div>
        </div>
      ),
    },
  ]);

  const [deletedItems, setDeletedItems] = useState<LibraryItem[]>([]);

  if (!isOpen) return null;

  // Toggle selection of a item
  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Delete selected items
  const handleDeleteSelected = () => {
    const toDelete = items.filter((item) => selectedIds.includes(item.id));
    setDeletedItems([...deletedItems, ...toDelete]);
    setItems(items.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  // Restore deleted item
  const handleRestoreItem = (id: string) => {
    const itemToRestore = deletedItems.find((i) => i.id === id);
    if (itemToRestore) {
      setItems([...items, itemToRestore]);
      setDeletedItems(deletedItems.filter((i) => i.id !== id));
    }
  };

  // Permanently delete item
  const handlePermanentDelete = (id: string) => {
    setDeletedItems(deletedItems.filter((i) => i.id !== id));
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: LibraryItem = {
        id: Date.now().toString(),
        type: 'folder',
        title: newFolderName.trim(),
        category: 'Dossier',
        isFolder: true,
        itemCount: 0,
        customRender: (
          <div className="w-full h-full bg-[#122033] p-4 flex flex-col items-center justify-center text-amber-400 border border-amber-500/30 rounded-2xl">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
            </svg>
            <span className="text-xs font-bold text-white mt-2 text-center line-clamp-1">
              {newFolderName.trim()}
            </span>
            <span className="text-[10px] text-slate-400">Dossier</span>
          </div>
        ),
      };
      setItems([newFolder, ...items]);
      setNewFolderName('');
      setIsFolderModalOpen(false);
    }
  };

  // Upload files trigger
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUploadedItems: LibraryItem[] = (Array.from(files) as File[]).map((file, idx) => {
        const isImg = file.type.startsWith('image/');
        const url = isImg ? URL.createObjectURL(file) : undefined;
        return {
          id: (Date.now() + idx).toString(),
          type: isImg ? 'image' : 'file',
          title: file.name,
          category: isImg ? 'Photos' : 'Documents',
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          imageUrl: url,
          customRender: isImg ? (
            <div className="w-full h-full relative overflow-hidden bg-slate-900">
              <img src={url} alt={file.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-full bg-[#121c2b] p-3 flex flex-col justify-between border border-slate-800">
              <div className="w-8 h-10 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                FILE
              </div>
              <div className="text-xs font-semibold text-slate-100 line-clamp-2">
                {file.name}
              </div>
            </div>
          ),
        };
      });
      setItems([...newUploadedItems, ...items]);
    }
  };

  // Current display collection
  const currentCollection = isTrashView ? deletedItems : items;

  // Filter items
  const filteredItems = currentCollection.filter((item) => {
    const matchesTab =
      activeTab === 'tous' ||
      (activeTab === 'images' && item.type === 'image') ||
      (activeTab === 'fichiers' && (item.type === 'file' || item.type === 'folder'));

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-40 bg-[#0a1628] text-slate-100 flex flex-col overflow-hidden animate-fade-in">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        className="hidden"
      />

      {/* Top Fixed Header Bar */}
      <div className="w-full bg-[#0a1628]/95 backdrop-blur-md border-b border-slate-800/60 shrink-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3.5 relative">
          {/* Back Arrow Button */}
          <button
            onClick={() => {
              if (isTrashView) {
                setIsTrashView(false);
              } else if (isSelectionMode) {
                setIsSelectionMode(false);
                setSelectedIds([]);
              } else {
                onClose();
              }
            }}
            className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-200 transition-colors"
            aria-label="Retour"
            title="Retour"
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

          {/* Title */}
          <span className="text-lg font-bold text-white tracking-tight">
            {isTrashView
              ? 'Supprimés (Corbeille)'
              : isSelectionMode
              ? `${selectedIds.length} sélectionné(s)`
              : 'Bibliothèque'}
          </span>

          {/* Options Menu Button (3 dots) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-slate-200 transition-colors ${
              isMenuOpen ? 'bg-slate-700 text-white' : 'bg-slate-800/80 hover:bg-slate-700'
            }`}
            aria-label="Options"
            title="Options"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {/* POPUP OPTIONS MENU OVERLAY (Exactly matching screenshot) */}
          {isMenuOpen && (
            <>
              {/* Invisible backdrop to dismiss menu when clicking outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />

              <div className="absolute top-14 right-4 z-50 w-72 bg-[#1c1c1e] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-2.5 space-y-1 animate-fade-in font-sans">
                {/* 1. Sélectionner */}
                <button
                  onClick={() => {
                    setIsSelectionMode(!isSelectionMode);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl hover:bg-slate-800/60 transition-colors text-left"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-200 shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-base font-medium text-white">Sélectionner</span>
                </button>

                {/* 2. Importer des fichiers */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl hover:bg-slate-800/60 transition-colors text-left"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-200 shrink-0"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-base font-medium text-white">Importer des fichiers</span>
                </button>

                {/* 3. Nouveau dossier */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsFolderModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl hover:bg-slate-800/60 transition-colors text-left"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-200 shrink-0"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                  <span className="text-base font-medium text-white">Nouveau dossier</span>
                </button>

                {/* DIVIDER */}
                <div className="border-t border-slate-800/80 my-1" />

                {/* 4. Grille */}
                <button
                  onClick={() => {
                    setViewMode('grid');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-slate-800/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-200 shrink-0"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                    </svg>
                    <span className="text-base font-medium text-white">Grille</span>
                  </div>
                  {viewMode === 'grid' && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                {/* 5. Liste */}
                <button
                  onClick={() => {
                    setViewMode('list');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-slate-800/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-200 shrink-0"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    <span className="text-base font-medium text-white">Liste</span>
                  </div>
                  {viewMode === 'list' && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                {/* DIVIDER */}
                <div className="border-t border-slate-800/80 my-1" />

                {/* 6. Supprimés */}
                <button
                  onClick={() => {
                    setIsTrashView(!isTrashView);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl hover:bg-slate-800/60 transition-colors text-left text-red-400 hover:text-red-300"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span className="text-base font-medium">
                    {isTrashView ? 'Bibliothèque principale' : 'Supprimés'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Filter Tabs / Options Row */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex items-center gap-2.5 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('tous')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
              activeTab === 'tous'
                ? 'bg-slate-700 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Tous
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
              activeTab === 'images'
                ? 'bg-slate-700 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Images
          </button>

          <button
            onClick={() => setActiveTab('fichiers')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
              activeTab === 'fichiers'
                ? 'bg-slate-700 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Fichiers
          </button>
        </div>
      </div>

      {/* Main Scrollable Library Canvas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto px-4 py-4 pb-32">
          {/* Top selection warning or actions bar if selection mode active */}
          {isSelectionMode && (
            <div className="mb-4 bg-slate-800/80 border border-slate-700 p-3 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">
                {selectedIds.length} élément(s) sélectionné(s)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (selectedIds.length === filteredItems.length) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(filteredItems.map((i) => i.id));
                    }
                  }}
                  className="text-xs bg-slate-700 px-3 py-1.5 rounded-lg text-slate-200 hover:bg-slate-600"
                >
                  {selectedIds.length === filteredItems.length ? 'Désélectionner tout' : 'Tout sélectionner'}
                </button>
                {selectedIds.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="text-xs bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-lg font-bold hover:bg-red-500/30"
                  >
                    Supprimer ({selectedIds.length})
                  </button>
                )}
              </div>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-60">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <p className="text-base font-medium text-slate-400">
                {isTrashView ? 'La corbeille est vide' : 'Aucun élément trouvé'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW MODE */
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      if (isSelectionMode) {
                        handleToggleSelect(item.id, e);
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                    className={`group relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden bg-[#111c2a] border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#00d4aa] ring-2 ring-[#00d4aa]/50'
                        : 'border-slate-800/80 hover:border-[#00d4aa]/50'
                    }`}
                  >
                    {item.customRender ? (
                      item.customRender
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-slate-300">
                        <span className="text-xs font-semibold">{item.title}</span>
                      </div>
                    )}

                    {/* Selection Checkbox Overlay */}
                    {isSelectionMode && (
                      <div className="absolute top-3 right-3 z-10">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#00d4aa] border-[#00d4aa] text-slate-950'
                              : 'bg-black/50 border-white/60'
                          }`}
                        >
                          {isSelected && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trash Restore option overlay if in trash view */}
                    {isTrashView && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestoreItem(item.id);
                          }}
                          className="px-3 py-1.5 bg-[#00d4aa] text-slate-950 font-bold text-xs rounded-xl"
                        >
                          Restaurer
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePermanentDelete(item.id);
                          }}
                          className="px-3 py-1.5 bg-red-500/80 text-white font-bold text-xs rounded-xl"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}

                    {/* Title overlay on hover */}
                    {!isTrashView && !isSelectionMode && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                        <span className="text-xs font-bold text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#00d4aa]">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW MODE */
            <div className="space-y-2.5">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      if (isSelectionMode) {
                        handleToggleSelect(item.id, e);
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                    className={`p-3 rounded-2xl bg-[#111c2a] border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00d4aa] ring-1 ring-[#00d4aa]/50'
                        : 'border-slate-800/80 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      {/* Thumbnail Box */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-800 flex items-center justify-center">
                        {item.type === 'image' && (
                          <div className="w-full h-full scale-90">{item.customRender}</div>
                        )}
                        {item.type === 'file' && (
                          <span className="text-xs font-bold text-emerald-400">FILE</span>
                        )}
                        {item.type === 'folder' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                          </svg>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-xs text-slate-400">
                          {item.category} {item.fileSize ? `• ${item.fileSize}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Checkbox or Restore buttons */}
                    {isSelectionMode ? (
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-[#00d4aa] border-[#00d4aa] text-slate-950'
                            : 'bg-black/50 border-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    ) : isTrashView ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestoreItem(item.id);
                          }}
                          className="px-3 py-1 bg-[#00d4aa]/20 text-[#00d4aa] border border-[#00d4aa]/40 text-xs font-bold rounded-lg"
                        >
                          Restaurer
                        </button>
                      </div>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Search Bar */}
      <div className="fixed bottom-4 left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="pointer-events-auto max-w-2xl mx-auto bg-[#182536]/90 backdrop-blur-md border border-slate-700/60 rounded-full px-4 py-3 shadow-2xl flex items-center gap-3 text-slate-200">
          <svg
            className="text-slate-400 shrink-0"
            width="18"
            height="18"
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
            placeholder="Rechercher dans la bibliothèque"
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Modal: New Folder Creation */}
      {isFolderModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsFolderModalOpen(false)}
        >
          <div
            className="bg-[#111c2a] border border-slate-700 rounded-3xl p-5 max-w-sm w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-white text-base">Nouveau dossier</h3>

            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du dossier..."
              className="w-full bg-[#18273a] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d4aa]"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-xl text-xs hover:bg-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-[#00d4aa] text-slate-950 font-bold rounded-xl text-xs hover:opacity-90"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Item Preview (if clicked) */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#111c2a] border border-slate-700 rounded-3xl p-5 max-w-sm w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-base">{selectedItem.title}</h3>
                <p className="text-xs text-[#00d4aa]">{selectedItem.category}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden border border-slate-800">
              {selectedItem.customRender}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm hover:bg-slate-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
