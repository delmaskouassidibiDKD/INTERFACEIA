import React, { useState, useEffect, useCallback, useRef, SetStateAction } from 'react';
import Background from './components/Background';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import SettingsModal from './components/SettingsModal';
import LibraryModal from './components/LibraryModal';
import SearchModal from './components/SearchModal';
import ChatThread, { ChatMessage } from './components/ChatThread';
import ConstructeurWorkspace from './components/ConstructeurWorkspace';
import Strands from './components/Strands';
import DotField from './components/DotField';
import { DnaLogo } from './components/DnaLogo';
import AgentsHub from './components/AgentsHub';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import CustomAgentView from './components/CustomAgentView';
import { BlueRobot } from './components/BlueRobot';

export interface ConstructeurProject {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const INITIAL_CONSTRUCTEUR_PROJECTS: ConstructeurProject[] = [
  { id: 'cp1', title: 'Site Web Vitrine React & Tailwind', messages: [], updatedAt: Date.now() - 5000 },
  { id: 'cp2', title: 'Application E-Commerce Fullstack', messages: [], updatedAt: Date.now() - 4000 },
  { id: 'cp3', title: 'API REST Express Server Node.js', messages: [], updatedAt: Date.now() - 3000 },
  { id: 'cp4', title: 'Dashboard SaaS Admin UI', messages: [], updatedAt: Date.now() - 2000 },
  { id: 'cp5', title: 'Composant Animé UI Motion', messages: [], updatedAt: Date.now() - 1000 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'chat' | 'constructeur' | 'profile'>('hub');
  const [mode, setMode] = useState<'chat' | 'constructeur'>('chat');
  const [agentMessagesMap, setAgentMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [agentInputMap, setAgentInputMap] = useState<Record<string, string>>({});
  const [constructeurProjects, setConstructeurProjects] = useState<ConstructeurProject[]>(INITIAL_CONSTRUCTEUR_PROJECTS);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState(
    "Tu es Delmas, un assistant intelligent, amical et concis."
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChatTitle, setActiveChatTitle] = useState<string | null>(null);
  const [chatAttachedFilesState, setChatAttachedFilesState] = useState<File[]>([]);
  const [constructeurAttachedFilesState, setConstructeurAttachedFilesState] = useState<File[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollToBottomRef = useRef<(() => void) | null>(null);

  const activeAgentKey = activeTab === 'constructeur'
    ? (activeChatTitle || "Agent Delmas")
    : (activeChatTitle || 'Delmas AI');

  const activeMessages = agentMessagesMap[activeAgentKey] || [];
  const activeInputMessage = agentInputMap[activeAgentKey] || '';

  const setActiveInputMessage = useCallback((val: string) => {
    setAgentInputMap((prev) => ({
      ...prev,
      [activeAgentKey]: val,
    }));
  }, [activeAgentKey]);

  const handleScrollStateChange = useCallback((show: boolean, scrollFn: () => void) => {
    setCanScrollDown(show);
    scrollToBottomRef.current = scrollFn;
  }, []);

  // Custom setChatAttachedFiles with validation ensuring max 10 elements
  const setChatAttachedFiles = useCallback(
    (action: React.SetStateAction<File[]>) => {
      setChatAttachedFilesState((prev) => {
        const next = typeof action === 'function' ? action(prev) : action;
        if (next.length > 10) return next.slice(0, 10);
        return next;
      });
    },
    []
  );

  // Custom setConstructeurAttachedFiles with validation ensuring max 10 elements
  const setConstructeurAttachedFiles = useCallback(
    (action: React.SetStateAction<File[]>) => {
      setConstructeurAttachedFilesState((prev) => {
        const next = typeof action === 'function' ? action(prev) : action;
        if (next.length > 10) return next.slice(0, 10);
        return next;
      });
    },
    []
  );

  const handleSendMessage = async (textToSend: string) => {
    const isConstructeur = activeTab === 'constructeur' || mode === 'constructeur';
    const targetAgentKey = activeAgentKey;
    const currentFiles = isConstructeur ? constructeurAttachedFilesState : chatAttachedFilesState;
    if (!textToSend.trim() && currentFiles.length === 0) return;

    let fullPrompt = textToSend;
    if (currentFiles.length > 0) {
      const fileNames = currentFiles.map((f) => f.name).join(', ');
      fullPrompt += `\n[Fichiers joints (${currentFiles.length}): ${fileNames}]`;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: fullPrompt,
      timestamp: new Date(),
    };

    const currentMsgList = agentMessagesMap[targetAgentKey] || [];
    const newMessages = [...currentMsgList, userMsg];

    setAgentMessagesMap((prev) => ({
      ...prev,
      [targetAgentKey]: newMessages,
    }));

    setAgentInputMap((prev) => ({
      ...prev,
      [targetAgentKey]: '',
    }));

    if (isConstructeur) {
      setConstructeurAttachedFilesState([]);
    } else {
      setChatAttachedFilesState([]);
    }

    setIsLoading(true);

    let activeProjectId = currentProjectId;

    // In Constructeur mode, create or update project in "Vos Projets"
    if (isConstructeur) {
      if (!activeProjectId) {
        activeProjectId = 'proj_' + Date.now();
        let rawTitle = textToSend.replace(/^[^\s]+\s*:\s*/, '').trim() || 'Nouveau Projet';
        if (rawTitle.length > 38) {
          rawTitle = rawTitle.slice(0, 38) + '...';
        }
        const newProj: ConstructeurProject = {
          id: activeProjectId,
          title: rawTitle,
          messages: newMessages,
          updatedAt: Date.now(),
        };
        setConstructeurProjects((prev) => [newProj, ...prev]);
        setCurrentProjectId(activeProjectId);
        setActiveChatTitle(rawTitle);
      } else {
        setConstructeurProjects((prev) =>
          prev.map((p) =>
            p.id === activeProjectId
              ? { ...p, messages: newMessages, updatedAt: Date.now() }
              : p
          )
        );
      }
    }

    const activeSystemInstruction = isConstructeur
      ? "Tu es Agent Delmas, un expert senior en développement de sites web, création d'applications web/mobile, design UI/UX et architecture logicielle. Fournis du code propre, moderne et structuré."
      : `Tu es ${targetAgentKey}, un assistant IA spécialisé. ${systemInstruction}`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          webSearch,
          imageMode,
          systemInstruction: activeSystemInstruction,
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || "Désolé, une erreur s'est produite.",
        sources: data.sources || [],
        timestamp: new Date(),
      };

      setAgentMessagesMap((prev) => {
        const existing = prev[targetAgentKey] || [];
        const updated = [...existing, aiMsg];
        if (isConstructeur && activeProjectId) {
          setConstructeurProjects((pList) =>
            pList.map((p) =>
              p.id === activeProjectId ? { ...p, messages: updated, updatedAt: Date.now() } : p
            )
          );
        }
        return {
          ...prev,
          [targetAgentKey]: updated,
        };
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Désolé, je ne peux pas me connecter au serveur pour le moment.",
        timestamp: new Date(),
      };
      setAgentMessagesMap((prev) => {
        const existing = prev[targetAgentKey] || [];
        const updated = [...existing, errorMsg];
        if (isConstructeur && activeProjectId) {
          setConstructeurProjects((pList) =>
            pList.map((p) =>
              p.id === activeProjectId ? { ...p, messages: updated, updatedAt: Date.now() } : p
            )
          );
        }
        return {
          ...prev,
          [targetAgentKey]: updated,
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setAgentMessagesMap((prev) => ({
      ...prev,
      [activeAgentKey]: [],
    }));
    setAgentInputMap((prev) => ({
      ...prev,
      [activeAgentKey]: '',
    }));
    setChatAttachedFiles([]);
    setMode('chat');
    setActiveTab('chat');
    setIsSidebarOpen(false);
  };

  const handleOpenChat = (agentName?: string, options?: { webSearch?: boolean; imageMode?: boolean }) => {
    if (options?.webSearch !== undefined) setWebSearch(options.webSearch);
    if (options?.imageMode !== undefined) setImageMode(options.imageMode);
    if (agentName) setActiveChatTitle(agentName);
    setMode('chat');
    setActiveTab('chat');
    setIsSidebarOpen(false);
  };

  const handleOpenConstructeur = () => {
    setCurrentProjectId(null);
    setActiveChatTitle("Agent Delmas");
    setConstructeurAttachedFiles([]);
    setMode('constructeur');
    setActiveTab('constructeur');
    setIsSidebarOpen(false);
  };

  const handleExitConstructeur = () => {
    if (currentProjectId) {
      const msgs = agentMessagesMap[activeAgentKey] || [];
      setConstructeurProjects((prev) =>
        prev.map((p) =>
          p.id === currentProjectId ? { ...p, messages: msgs, updatedAt: Date.now() } : p
        )
      );
    }
    setCurrentProjectId(null);
    setConstructeurAttachedFiles([]);
    setMode('chat');
    setActiveTab('hub');
    setIsSidebarOpen(false);
  };

  const handleClearHistory = () => {
    setAgentMessagesMap({});
    setAgentInputMap({});
    setActiveChatTitle(null);
    setCurrentProjectId(null);
  };

  const handleSelectChatTopic = (title: string, projectId?: string) => {
    setIsSidebarOpen(false);
    setActiveChatTitle(title);
    if (title === 'Bibliothèque') {
      setIsLibraryOpen(true);
      return;
    }
    if (title === 'Constructeur') {
      handleOpenConstructeur();
      return;
    }

    // Check if it's a project in constructeurProjects
    const targetProject = constructeurProjects.find(
      (p) => (projectId && p.id === projectId) || p.title === title
    );

    if (targetProject) {
      setMode('constructeur');
      setActiveTab('constructeur');
      setCurrentProjectId(targetProject.id);
      setActiveChatTitle(targetProject.title);
      setAgentMessagesMap((prev) => ({
        ...prev,
        [targetProject.title]: targetProject.messages,
      }));
      return;
    }

    // Standard chat topic
    setMode('chat');
    setActiveTab('chat');
    const existing = agentMessagesMap[title];
    if (!existing || existing.length === 0) {
      handleSendMessage(title);
    }
  };

  const isConstructeurThreadActive =
    activeTab === 'constructeur' && (currentProjectId !== null || activeMessages.length > 0);
  const isChatThreadActive = activeMessages.length > 0;
  const isCustomAgentChat =
    activeTab === 'chat' &&
    Boolean(activeChatTitle) &&
    activeChatTitle !== 'Delmas AI' &&
    activeChatTitle !== 'Delmas AI Hub' &&
    activeChatTitle !== 'Delmas';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0b0f19] text-slate-100 font-sans antialiased">
      {/* Background fixed layers */}
      <Background />

      {/* Top Header - shown during Delmas AI main chat view */}
      {activeTab === 'chat' && !isCustomAgentChat && (
        <Header
          onOpenMenu={() => setIsSidebarOpen(true)}
          onNewChat={handleNewChat}
          onOpenConstructeur={handleOpenConstructeur}
          onExitConstructeur={handleExitConstructeur}
          onBackToHub={() => {
            setActiveTab('hub');
            setMode('chat');
            setIsSidebarOpen(false);
          }}
          isConstructeurMode={false}
        />
      )}



      {/* Left Drawer Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectChat={handleSelectChatTopic}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeChatTitle={activeChatTitle}
        isConstructeurMode={activeTab === 'constructeur'}
        onOpenConstructeur={handleOpenConstructeur}
        onExitConstructeur={handleExitConstructeur}
        constructeurProjects={constructeurProjects}
      />

      {/* Settings Dialog Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        systemInstruction={systemInstruction}
        setSystemInstruction={setSystemInstruction}
        webSearch={webSearch}
        setWebSearch={setWebSearch}
        imageMode={imageMode}
        setImageMode={setImageMode}
      />

      {/* Library View Modal */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />

      {/* Search View Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChat={handleSelectChatTopic}
      />

      {/* MAIN CONTENT VIEW BASED ON ACTIVE TAB */}
      {activeTab === 'hub' ? (
        <AgentsHub
          onOpenChat={handleOpenChat}
          onOpenConstructeur={handleOpenConstructeur}
          onOpenMenu={() => setIsSidebarOpen(true)}
        />
      ) : activeTab === 'profile' ? (
        <ProfileView
          onOpenSettings={() => setIsSettingsOpen(true)}
          webSearch={webSearch}
          setWebSearch={setWebSearch}
          imageMode={imageMode}
          setImageMode={setImageMode}
          onClearHistory={handleClearHistory}
          systemInstruction={systemInstruction}
        />
      ) : activeTab === 'constructeur' ? (
        /* CONSTRUCTEUR / AGENT DELMAS VIEW */
        <CustomAgentView
          agentName={activeChatTitle || "Agent Delmas"}
          userName="DIBI Kouassi delmas..."
          messages={activeMessages}
          isLoading={isLoading}
          inputMessage={activeInputMessage}
          setInputMessage={setActiveInputMessage}
          onSend={handleSendMessage}
          onOpenMenu={() => setIsSidebarOpen(true)}
          onBackToHub={() => {
            setActiveTab('hub');
            setMode('chat');
            setIsSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          webSearch={webSearch}
          setWebSearch={setWebSearch}
          imageMode={imageMode}
          setImageMode={setImageMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
          attachedFiles={constructeurAttachedFilesState}
          setAttachedFiles={setConstructeurAttachedFiles}
        />
      ) : isCustomAgentChat ? (
        /* DEDICATED CUSTOM AGENT VIEW WITH BLUE ROBOT & TOP HEADER BUTTONS */
        <CustomAgentView
          agentName={activeChatTitle!}
          userName="DIBI Kouassi delmas..."
          messages={activeMessages}
          isLoading={isLoading}
          inputMessage={activeInputMessage}
          setInputMessage={setActiveInputMessage}
          onSend={handleSendMessage}
          onOpenMenu={() => setIsSidebarOpen(true)}
          onBackToHub={() => {
            setActiveTab('hub');
            setMode('chat');
            setIsSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          webSearch={webSearch}
          setWebSearch={setWebSearch}
          imageMode={imageMode}
          setImageMode={setImageMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
          attachedFiles={chatAttachedFilesState}
          setAttachedFiles={setChatAttachedFiles}
        />
      ) : (
        /* CHAT VIEW (Delmas AI Main Robot) */
        !isChatThreadActive ? (
          // STANDARD DELMAS AI LANDING VIEW WITH ANIMATED COLORS
          <main className="relative z-10 flex-1 flex flex-col items-center justify-between pb-2 px-3 pt-12 min-h-screen overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <Strands
                  colors={["#F97316","#7C3AED","#06B6D4"]}
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

            <div className="relative z-10 my-auto flex flex-col items-center text-center">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-150 animate-pulse pointer-events-none" />
                <DnaLogo className="w-12 h-12 sm:w-14 sm:h-14 relative z-10 text-amber-400 drop-shadow-[0_0_18px_rgba(243,128,32,0.7)]" glow={true} />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white/95 tracking-tight">
                {activeChatTitle && activeChatTitle !== 'Delmas AI' && activeChatTitle !== 'Delmas AI Hub'
                  ? activeChatTitle
                  : "Comment puis-je vous aider ?"}
              </h1>
            </div>

            <div className="chat-container relative z-10 flex flex-col justify-end w-full max-w-[820px] mb-1 sm:mb-2">
              <ChatBox
                variant="compact"
                inputMessage={activeInputMessage}
                setInputMessage={setActiveInputMessage}
                onSend={handleSendMessage}
                webSearch={webSearch}
                setWebSearch={setWebSearch}
                imageMode={imageMode}
                setImageMode={setImageMode}
                onOpenSettings={() => setIsSettingsOpen(true)}
                attachedFiles={chatAttachedFilesState}
                setAttachedFiles={setChatAttachedFiles}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 150)}
              />
            </div>
          </main>
        ) : (
          // ACTIVE DELMAS AI CHAT THREAD VIEW
          <main className="relative z-10 flex-1 flex flex-col pt-10 pb-24 justify-between">
            <ChatThread
              messages={activeMessages}
              isLoading={isLoading}
              onNewChat={handleNewChat}
              onScrollStateChange={handleScrollStateChange}
            />

            <div className="fixed bottom-2 sm:bottom-3 left-0 right-0 z-20 px-2 sm:px-4 flex justify-center">
              <div className="w-full max-w-[820px] relative">
                <button
                  type="button"
                  onClick={() => scrollToBottomRef.current?.()}
                  className={`absolute -top-13 right-2 sm:right-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-[#1e2736]/90 hover:bg-[#2b384d] border border-slate-700/80 text-amber-400 hover:text-amber-300 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out active:scale-90 ${
                    canScrollDown
                      ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
                      : 'opacity-0 translate-y-2 pointer-events-none scale-90'
                  }`}
                  aria-label="Défiler vers le bas"
                  title="Défiler vers le bas"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </button>

                <ChatBox
                  variant="compact"
                  inputMessage={activeInputMessage}
                  setInputMessage={setActiveInputMessage}
                  onSend={handleSendMessage}
                  webSearch={webSearch}
                  setWebSearch={setWebSearch}
                  imageMode={imageMode}
                  setImageMode={setImageMode}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  attachedFiles={chatAttachedFilesState}
                  setAttachedFiles={setChatAttachedFiles}
                />
              </div>
            </div>
          </main>
        )
      )}

      {/* Persistent Bottom Navigation Bar - visible on Hub and Profile tabs */}
      {(activeTab === 'hub' || activeTab === 'profile') && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'constructeur') {
              setMode('constructeur');
              if (!activeChatTitle || activeChatTitle === "Créateur d'Agents") {
                setActiveChatTitle("Agent Delmas");
              }
            } else {
              setMode('chat');
            }
          }}
        />
      )}
    </div>
  );
}
