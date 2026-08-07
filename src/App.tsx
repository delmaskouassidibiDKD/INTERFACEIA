import React, { useState, useCallback, useRef } from 'react';
import Background from './components/Background';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import SettingsModal, { SharedSettings, DEFAULT_SHARED_SETTINGS } from './components/SettingsModal';
import LibraryModal from './components/LibraryModal';
import SearchModal from './components/SearchModal';
import ChatThread, { ChatMessage } from './components/ChatThread';
import Strands from './components/Strands';
import { DnaLogo } from './components/DnaLogo';
import AgentsHub from './components/AgentsHub';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import CustomAgentView from './components/CustomAgentView';

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Shared API call helper ───────────────────────────────────────────────────

async function callChatAPI(
  messages: ChatMessage[],
  opts: { webSearch: boolean; imageMode: boolean; systemInstruction: string }
) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      webSearch: opts.webSearch,
      imageMode: opts.imageMode,
      systemInstruction: opts.systemInstruction,
    }),
  });
  return res.json();
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  // ═══════════════════════════════════════════════════════════════════════════
  // TOP-LEVEL TAB  (navigation only – no chat state shared here)
  // ═══════════════════════════════════════════════════════════════════════════
  const [activeTab, setActiveTab] = useState<'hub' | 'chat' | 'constructeur' | 'profile'>('hub');

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOBAL SHARED SETTINGS  (persists across all sections — not per-section)
  // userName, theme, accentColor, language, memories are global user prefs.
  // ═══════════════════════════════════════════════════════════════════════════
  const [sharedSettings, setSharedSettings] = useState<SharedSettings>(DEFAULT_SHARED_SETTINGS);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1 — HUB  (agents list, no chat state)
  // ═══════════════════════════════════════════════════════════════════════════
  const [hubSidebarOpen, setHubSidebarOpen] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2 — DELMAS AI CHAT  (orange DNA robot + custom agents from Hub)
  // ═══════════════════════════════════════════════════════════════════════════
  const [chatMessagesMap, setChatMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [chatInputMap, setChatInputMap]       = useState<Record<string, string>>({});
  const [chatActiveName, setChatActiveName]   = useState('Delmas AI');
  const [chatWebSearch, setChatWebSearch]     = useState(false);
  const [chatImageMode, setChatImageMode]     = useState(false);
  const [chatSystemInstruction, setChatSystemInstruction] = useState(
    "Tu es Delmas, un assistant intelligent, amical et concis."
  );
  const [chatAttachedFiles, setChatAttachedFilesRaw] = useState<File[]>([]);
  const [chatLoading, setChatLoading]         = useState(false);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [chatSettingsOpen, setChatSettingsOpen] = useState(false);
  const [chatLibraryOpen, setChatLibraryOpen] = useState(false);
  const [chatSearchOpen, setChatSearchOpen]   = useState(false);
  const [chatCanScroll, setChatCanScroll]     = useState(false);
  const chatScrollFn = useRef<(() => void) | null>(null);

  const chatMessages = chatMessagesMap[chatActiveName] || [];
  const chatInput    = chatInputMap[chatActiveName] || '';

  const setChatInput = useCallback((val: string) => {
    setChatInputMap((p) => ({ ...p, [chatActiveName]: val }));
  }, [chatActiveName]);

  const setChatAttachedFiles = useCallback((action: React.SetStateAction<File[]>) => {
    setChatAttachedFilesRaw((p) => {
      const n = typeof action === 'function' ? action(p) : action;
      return n.length > 10 ? n.slice(0, 10) : n;
    });
  }, []);

  const handleChatSend = async (text: string) => {
    const files = chatAttachedFiles;
    if (!text.trim() && files.length === 0) return;

    let prompt = text;
    if (files.length > 0) prompt += `\n[Fichiers joints (${files.length}): ${files.map((f) => f.name).join(', ')}]`;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt, timestamp: new Date() };
    const name   = chatActiveName;
    const prev   = chatMessagesMap[name] || [];
    const msgs   = [...prev, userMsg];

    setChatMessagesMap((m) => ({ ...m, [name]: msgs }));
    setChatInputMap((m)    => ({ ...m, [name]: '' }));
    setChatAttachedFilesRaw([]);
    setChatLoading(true);

    try {
      const data = await callChatAPI(msgs, {
        webSearch: chatWebSearch,
        imageMode: chatImageMode,
        systemInstruction: `Tu es ${name}, un assistant IA spécialisé. ${chatSystemInstruction}`,
      });
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: data.text || "Désolé, une erreur s'est produite.",
        sources: data.sources || [], timestamp: new Date(),
      };
      setChatMessagesMap((m) => ({ ...m, [name]: [...(m[name] || []), aiMsg] }));
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: "Désolé, je ne peux pas me connecter au serveur.", timestamp: new Date(),
      };
      setChatMessagesMap((m) => ({ ...m, [name]: [...(m[name] || []), errMsg] }));
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatNewChat = () => {
    setChatActiveName('Delmas AI');
    setChatAttachedFilesRaw([]);
    setChatSidebarOpen(false);
  };

  const handleChatSelectTopic = (title: string) => {
    setChatSidebarOpen(false);
    if (title === 'Bibliothèque') { setChatLibraryOpen(true); return; }
    setChatActiveName(title);
  };

  const handleChatScrollState = useCallback((show: boolean, fn: () => void) => {
    setChatCanScroll(show);
    chatScrollFn.current = fn;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3 — AGENT DELMAS / CONSTRUCTEUR
  // ═══════════════════════════════════════════════════════════════════════════
  const [agentMsgsMap, setAgentMsgsMap]           = useState<Record<string, ChatMessage[]>>({});
  const [agentInputMap, setAgentInputMap]         = useState<Record<string, string>>({});
  const [constructeurProjects, setConstructeurProjects] = useState<ConstructeurProject[]>(INITIAL_CONSTRUCTEUR_PROJECTS);
  const [currentProjectId, setCurrentProjectId]   = useState<string | null>(null);
  const [agentWebSearch, setAgentWebSearch]       = useState(false);
  const [agentImageMode, setAgentImageMode]       = useState(false);
  const [agentSystemInstruction, setAgentSystemInstruction] = useState(
    "Tu es Agent Delmas, un expert senior en développement de sites web, création d'applications web/mobile, design UI/UX et architecture logicielle. Fournis du code propre, moderne et structuré."
  );
  const [agentAttachedFiles, setAgentAttachedFilesRaw] = useState<File[]>([]);
  const [agentLoading, setAgentLoading]           = useState(false);
  const [agentSidebarOpen, setAgentSidebarOpen]   = useState(false);
  const [agentSettingsOpen, setAgentSettingsOpen] = useState(false);

  const agentKey     = currentProjectId || 'default';
  const agentMessages = agentMsgsMap[agentKey] || [];
  const agentInput   = agentInputMap[agentKey] || '';
  const agentTitle   = currentProjectId
    ? (constructeurProjects.find((p) => p.id === currentProjectId)?.title || 'Agent Delmas')
    : 'Agent Delmas';

  const setAgentInput = useCallback((val: string) => {
    setAgentInputMap((p) => ({ ...p, [agentKey]: val }));
  }, [agentKey]);

  const setAgentAttachedFiles = useCallback((action: React.SetStateAction<File[]>) => {
    setAgentAttachedFilesRaw((p) => {
      const n = typeof action === 'function' ? action(p) : action;
      return n.length > 10 ? n.slice(0, 10) : n;
    });
  }, []);

  const handleAgentSend = async (text: string) => {
    const files = agentAttachedFiles;
    if (!text.trim() && files.length === 0) return;

    let prompt = text;
    if (files.length > 0) prompt += `\n[Fichiers joints (${files.length}): ${files.map((f) => f.name).join(', ')}]`;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt, timestamp: new Date() };

    // Create project on first message if none selected
    let pid = currentProjectId;
    if (!pid) {
      pid = 'proj_' + Date.now();
      let title = text.replace(/^[^\s]+\s*:\s*/, '').trim() || 'Nouveau Projet';
      if (title.length > 38) title = title.slice(0, 38) + '...';
      setConstructeurProjects((prev) => [{ id: pid!, title, messages: [], updatedAt: Date.now() }, ...prev]);
      setCurrentProjectId(pid);
    }

    const activeKey = pid;
    const prev      = agentMsgsMap[activeKey] || [];
    const msgs      = [...prev, userMsg];

    setAgentMsgsMap((m)   => ({ ...m, [activeKey]: msgs }));
    setAgentInputMap((m)  => ({ ...m, [agentKey]: '' }));
    setAgentAttachedFilesRaw([]);
    setAgentLoading(true);

    try {
      const data = await callChatAPI(msgs, {
        webSearch: agentWebSearch,
        imageMode: agentImageMode,
        systemInstruction: agentSystemInstruction,
      });
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: data.text || "Désolé, une erreur s'est produite.",
        sources: data.sources || [], timestamp: new Date(),
      };
      setAgentMsgsMap((m) => ({ ...m, [activeKey]: [...(m[activeKey] || []), aiMsg] }));
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: "Désolé, je ne peux pas me connecter au serveur.", timestamp: new Date(),
      };
      setAgentMsgsMap((m) => ({ ...m, [activeKey]: [...(m[activeKey] || []), errMsg] }));
    } finally {
      setAgentLoading(false);
    }
  };

  const handleAgentNewProject = () => {
    setCurrentProjectId(null);
    setAgentAttachedFilesRaw([]);
    setAgentSidebarOpen(false);
  };

  const handleAgentSelectProject = (title: string, projectId?: string) => {
    setAgentSidebarOpen(false);
    if (!projectId) return;
    const project = constructeurProjects.find((p) => p.id === projectId);
    if (!project) return;
    setCurrentProjectId(projectId);
    // Load project messages into the map if not already there
    setAgentMsgsMap((m) => ({ ...m, [projectId]: project.messages }));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4 — PROFILE  (own settings, own toggles, isolated)
  // ═══════════════════════════════════════════════════════════════════════════
  const [profileWebSearch, setProfileWebSearch]   = useState(false);
  const [profileImageMode, setProfileImageMode]   = useState(false);
  const [profileSystemInstruction, setProfileSystemInstruction] = useState(
    "Tu es Delmas, un assistant intelligent, amical et concis."
  );
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // NAV HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Called by Hub assistant cards — opens Chat with specific agent/options
  const openChatFromHub = (agentName?: string, options?: { webSearch?: boolean; imageMode?: boolean }) => {
    if (agentName) setChatActiveName(agentName);
    // Only apply Hub-requested options; never touch other sections
    if (options?.webSearch  !== undefined) setChatWebSearch(options.webSearch);
    if (options?.imageMode  !== undefined) setChatImageMode(options.imageMode);
    setChatAttachedFilesRaw([]);
    setChatSidebarOpen(false);
    setActiveTab('chat');
  };

  // Called by Hub "Créer un assistant" — opens Agent fresh
  const openConstructeurFromHub = () => {
    setCurrentProjectId(null);
    setAgentAttachedFilesRaw([]);
    setAgentSidebarOpen(false);
    setActiveTab('constructeur');
  };

  // Called by BottomNav — each section gets a completely clean isolated state
  const handleNavTabChange = (tab: 'hub' | 'chat' | 'constructeur' | 'profile') => {
    if (tab === 'chat') {
      // Full reset — Chat section starts fresh from BottomNav
      setChatActiveName('Delmas AI');
      setChatWebSearch(false);
      setChatImageMode(false);
      setChatAttachedFilesRaw([]);
      setChatSidebarOpen(false);
      setChatSettingsOpen(false);
      setChatLibraryOpen(false);
      setChatSearchOpen(false);
    }
    if (tab === 'constructeur') {
      // Full reset — Agent section starts fresh from BottomNav
      setCurrentProjectId(null);
      setAgentWebSearch(false);
      setAgentImageMode(false);
      setAgentAttachedFilesRaw([]);
      setAgentSidebarOpen(false);
      setAgentSettingsOpen(false);
    }
    if (tab === 'hub') {
      setHubSidebarOpen(false);
    }
    if (tab === 'profile') {
      setProfileSettingsOpen(false);
      setProfileWebSearch(false);
      setProfileImageMode(false);
    }
    setActiveTab(tab);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const isCustomAgentChat   = activeTab === 'chat' && chatActiveName !== 'Delmas AI';
  const chatHasMessages     = chatMessages.length > 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0b0f19] text-slate-100 font-sans antialiased">
      <Background />

      {/* ───────────────────────── HUB ───────────────────────────────────── */}
      {activeTab === 'hub' && (
        <>
          <Sidebar
            isOpen={hubSidebarOpen}
            onClose={() => setHubSidebarOpen(false)}
            onSelectChat={(title) => { setHubSidebarOpen(false); openChatFromHub(title); }}
            onNewChat={() => { setHubSidebarOpen(false); openChatFromHub('Delmas AI'); }}
            onOpenSettings={() => setHubSidebarOpen(false)}
            activeChatTitle={null}
            isConstructeurMode={false}
          />
          <AgentsHub
            onOpenChat={openChatFromHub}
            onOpenConstructeur={openConstructeurFromHub}
            onOpenMenu={() => setHubSidebarOpen(true)}
          />
        </>
      )}

      {/* ───────────────────── DELMAS AI CHAT ───────────────────────────── */}
      {activeTab === 'chat' && (
        <>
          {/* Own sidebar for Chat section */}
          <Sidebar
            isOpen={chatSidebarOpen}
            onClose={() => setChatSidebarOpen(false)}
            onSelectChat={handleChatSelectTopic}
            onNewChat={handleChatNewChat}
            onOpenSettings={() => { setChatSidebarOpen(false); setChatSettingsOpen(true); }}
            onOpenSearch={() => { setChatSidebarOpen(false); setChatSearchOpen(true); }}
            activeChatTitle={chatActiveName}
            isConstructeurMode={false}
          />

          {/* Own modals for Chat section */}
          <SettingsModal
            isOpen={chatSettingsOpen}
            onClose={() => setChatSettingsOpen(false)}
            systemInstruction={chatSystemInstruction}
            setSystemInstruction={setChatSystemInstruction}
            webSearch={chatWebSearch}
            setWebSearch={setChatWebSearch}
            imageMode={chatImageMode}
            setImageMode={setChatImageMode}
            shared={sharedSettings}
            setShared={setSharedSettings}
          />
          <LibraryModal isOpen={chatLibraryOpen} onClose={() => setChatLibraryOpen(false)} />
          <SearchModal
            isOpen={chatSearchOpen}
            onClose={() => setChatSearchOpen(false)}
            onSelectChat={handleChatSelectTopic}
          />

          {/* Custom agent (blue robot assistants) — key forces isolated DOM per assistant */}
          {isCustomAgentChat ? (
            <CustomAgentView
              key={`chat-assistant-${chatActiveName}`}
              agentName={chatActiveName}
              userName="DIBI Kouassi delmas..."
              messages={chatMessages}
              isLoading={chatLoading}
              inputMessage={chatInput}
              setInputMessage={setChatInput}
              onSend={handleChatSend}
              onOpenMenu={() => setChatSidebarOpen(true)}
              onBackToHub={() => setActiveTab('hub')}
              onNewChat={handleChatNewChat}
              webSearch={chatWebSearch}
              setWebSearch={setChatWebSearch}
              imageMode={chatImageMode}
              setImageMode={setChatImageMode}
              onOpenSettings={() => setChatSettingsOpen(true)}
              attachedFiles={chatAttachedFiles}
              setAttachedFiles={setChatAttachedFiles}
            />
          ) : (
            /* Main Delmas AI (orange DNA robot) */
            <>
              <Header
                onOpenMenu={() => setChatSidebarOpen(true)}
                onNewChat={handleChatNewChat}
                onOpenConstructeur={openConstructeurFromHub}
                onExitConstructeur={() => setActiveTab('hub')}
                onBackToHub={() => setActiveTab('hub')}
                isConstructeurMode={false}
              />

              {!chatHasMessages ? (
                /* Landing — no messages yet */
                <main className="relative z-10 flex-1 flex flex-col items-center justify-between pb-2 px-3 pt-12 min-h-screen overflow-hidden">
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <Strands
                        colors={["#F97316","#7C3AED","#06B6D4"]}
                        count={3} speed={0.4} amplitude={0.95} waviness={0.95}
                        thickness={0.6} glow={2.0} taper={3} spread={1}
                        intensity={0.48} saturation={1.4} opacity={0.78}
                        scale={1.5} glass={false} refraction={1} dispersion={1}
                        glassSize={1} hueShift={0}
                      />
                    </div>
                  </div>

                  <div className="relative z-10 my-auto flex flex-col items-center text-center">
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-150 animate-pulse pointer-events-none" />
                      <DnaLogo
                        className="w-12 h-12 sm:w-14 sm:h-14 relative z-10 text-amber-400 drop-shadow-[0_0_18px_rgba(243,128,32,0.7)]"
                        glow={true}
                      />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white/95 tracking-tight">
                      Comment puis-je vous aider ?
                    </h1>
                  </div>

                  <div className="chat-container relative z-10 flex flex-col justify-end w-full max-w-[820px] mb-1 sm:mb-2">
                    <ChatBox
                      key="chat-landing-box"
                      variant="compact"
                      inputMessage={chatInput}
                      setInputMessage={setChatInput}
                      onSend={handleChatSend}
                      webSearch={chatWebSearch}
                      setWebSearch={setChatWebSearch}
                      imageMode={chatImageMode}
                      setImageMode={setChatImageMode}
                      onOpenSettings={() => setChatSettingsOpen(true)}
                      attachedFiles={chatAttachedFiles}
                      setAttachedFiles={setChatAttachedFiles}
                    />
                  </div>
                </main>
              ) : (
                /* Active chat thread */
                <main className="relative z-10 flex-1 flex flex-col pt-10 pb-24 justify-between">
                  <ChatThread
                    messages={chatMessages}
                    isLoading={chatLoading}
                    onNewChat={handleChatNewChat}
                    onScrollStateChange={handleChatScrollState}
                  />
                  <div className="fixed bottom-2 sm:bottom-3 left-0 right-0 z-20 px-2 sm:px-4 flex justify-center">
                    <div className="w-full max-w-[820px] relative">
                      <button
                        type="button"
                        onClick={() => chatScrollFn.current?.()}
                        className={`absolute -top-13 right-2 sm:right-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-[#1e2736]/90 hover:bg-[#2b384d] border border-slate-700/80 text-amber-400 hover:text-amber-300 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out active:scale-90 ${
                          chatCanScroll ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' : 'opacity-0 translate-y-2 pointer-events-none scale-90'
                        }`}
                        aria-label="Défiler vers le bas"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <polyline points="19 12 12 19 5 12" />
                        </svg>
                      </button>

                      <ChatBox
                        key="chat-thread-box"
                        variant="compact"
                        inputMessage={chatInput}
                        setInputMessage={setChatInput}
                        onSend={handleChatSend}
                        webSearch={chatWebSearch}
                        setWebSearch={setChatWebSearch}
                        imageMode={chatImageMode}
                        setImageMode={setChatImageMode}
                        onOpenSettings={() => setChatSettingsOpen(true)}
                        attachedFiles={chatAttachedFiles}
                        setAttachedFiles={setChatAttachedFiles}
                      />
                    </div>
                  </div>
                </main>
              )}
            </>
          )}
        </>
      )}

      {/* ─────────────────── AGENT DELMAS / CONSTRUCTEUR ─────────────────── */}
      {activeTab === 'constructeur' && (
        <>
          {/* Own sidebar for Agent Delmas section */}
          <Sidebar
            isOpen={agentSidebarOpen}
            onClose={() => setAgentSidebarOpen(false)}
            onSelectChat={handleAgentSelectProject}
            onNewChat={handleAgentNewProject}
            onOpenSettings={() => { setAgentSidebarOpen(false); setAgentSettingsOpen(true); }}
            activeChatTitle={agentTitle}
            isConstructeurMode={true}
            onOpenConstructeur={handleAgentNewProject}
            constructeurProjects={constructeurProjects}
          />

          {/* Own settings modal for Agent Delmas section */}
          <SettingsModal
            isOpen={agentSettingsOpen}
            onClose={() => setAgentSettingsOpen(false)}
            systemInstruction={agentSystemInstruction}
            setSystemInstruction={setAgentSystemInstruction}
            webSearch={agentWebSearch}
            setWebSearch={setAgentWebSearch}
            imageMode={agentImageMode}
            setImageMode={setAgentImageMode}
            shared={sharedSettings}
            setShared={setSharedSettings}
          />

          {/* key forces isolated DOM instance — never shares state with Chat section */}
          <CustomAgentView
            key={`agent-delmas-${agentKey}`}
            agentName={agentTitle}
            userName="DIBI Kouassi delmas..."
            messages={agentMessages}
            isLoading={agentLoading}
            inputMessage={agentInput}
            setInputMessage={setAgentInput}
            onSend={handleAgentSend}
            onOpenMenu={() => setAgentSidebarOpen(true)}
            onBackToHub={() => setActiveTab('hub')}
            onNewChat={handleAgentNewProject}
            webSearch={agentWebSearch}
            setWebSearch={setAgentWebSearch}
            imageMode={agentImageMode}
            setImageMode={setAgentImageMode}
            onOpenSettings={() => setAgentSettingsOpen(true)}
            attachedFiles={agentAttachedFiles}
            setAttachedFiles={setAgentAttachedFiles}
          />
        </>
      )}

      {/* ─────────────────────────── PROFILE ─────────────────────────────── */}
      {activeTab === 'profile' && (
        <>
          {/* Own settings modal for Profile section */}
          <SettingsModal
            isOpen={profileSettingsOpen}
            onClose={() => setProfileSettingsOpen(false)}
            systemInstruction={profileSystemInstruction}
            setSystemInstruction={setProfileSystemInstruction}
            webSearch={profileWebSearch}
            setWebSearch={setProfileWebSearch}
            imageMode={profileImageMode}
            setImageMode={setProfileImageMode}
            shared={sharedSettings}
            setShared={setSharedSettings}
          />
          <ProfileView
            onOpenSettings={() => setProfileSettingsOpen(true)}
            webSearch={profileWebSearch}
            setWebSearch={setProfileWebSearch}
            imageMode={profileImageMode}
            setImageMode={setProfileImageMode}
            onClearHistory={() => {}}
            systemInstruction={profileSystemInstruction}
          />
        </>
      )}

      {/* Bottom nav — visible on Hub and Profile only */}
      {(activeTab === 'hub' || activeTab === 'profile') && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleNavTabChange}
        />
      )}
    </div>
  );
}
