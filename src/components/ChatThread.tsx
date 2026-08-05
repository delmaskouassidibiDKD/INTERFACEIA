import React, { useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { uri: string; title: string }[];
  timestamp: Date;
}

interface ChatThreadProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onNewChat: () => void;
  onScrollStateChange?: (showScrollDown: boolean, scrollToBottom: () => void) => void;
}

interface UserMessageBubbleProps {
  key?: string;
  content: string;
}

function UserMessageBubble({ content }: UserMessageBubbleProps) {
  const isLong = content.length > 130 || content.split('\n').length > 2;
  const [isExpanded, setIsExpanded] = useState(!isLong);

  const displayContent = isExpanded
    ? content
    : content.slice(0, 120).trim() + '...';

  return (
    <div className="flex justify-end my-2 animate-fade-in">
      <div
        onClick={() => isLong && setIsExpanded(!isExpanded)}
        className={`max-w-[85%] sm:max-w-[78%] bg-[#1a222d] border border-slate-800/80 text-slate-100 text-[15px] leading-relaxed px-5 py-3 rounded-[24px] shadow-sm transition-all ${
          isLong ? 'cursor-pointer hover:border-slate-700 select-none' : ''
        }`}
      >
        <div className="flex items-start gap-2 justify-between">
          <p className="whitespace-pre-wrap flex-1">
            {isLong && !isExpanded ? displayContent : content}
          </p>
          {isLong && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-0.5 ml-2 text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-full hover:bg-slate-800/80 shrink-0"
              aria-label={isExpanded ? "Replier" : "Déplier"}
              title={isExpanded ? "Replier le message" : "Déplier le message"}
            >
              <svg
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>
        {isLong && !isExpanded && (
          <div className="text-[11px] text-[#00d4aa] font-medium mt-1 flex items-center gap-1 opacity-90 hover:opacity-100">
            <span>Afficher la suite</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatThread({ messages, isLoading, onScrollStateChange }: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, 'like' | 'dislike' | null>>({});

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    const canScroll = distanceToBottom > 60;
    setShowScrollDown(canScroll);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    const timer = setTimeout(() => {
      handleScroll();
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  useEffect(() => {
    if (onScrollStateChange) {
      onScrollStateChange(showScrollDown, scrollToBottom);
    }
  }, [showScrollDown, onScrollStateChange]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const toggleReaction = (id: string, type: 'like' | 'dislike') => {
    setLikedMap((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto flex-1 h-full overflow-hidden px-3 sm:px-4 pt-0">
      {/* Messages Scroll Area */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto space-y-7 pr-1 custom-scrollbar pb-8">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isLastMessage = index === messages.length - 1;

          if (isUser) {
            return <UserMessageBubble key={msg.id} content={msg.content} />;
          }

          {/* Assistant Message: Plain text layout, no box wrapper */}
          return (
            <div key={msg.id} className="flex flex-col items-start gap-3 my-2 animate-fade-in">
              {/* Text content directly on canvas */}
              <div className="w-full text-slate-100 text-[15px] sm:text-[16px] leading-relaxed whitespace-pre-wrap font-normal">
                {msg.content}
              </div>

              {/* Sources / Grounding Links if available */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 text-xs">
                  <span className="text-slate-400 font-medium block mb-1.5">Sources :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-[#14202e] border border-slate-700/50 text-[#00d4aa] hover:underline text-[12px] truncate max-w-[220px]"
                      >
                        🌐 {src.title || src.uri}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Toolbar under AI Response */}
              <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                {/* Thumbs Up (Like) */}
                <button
                  onClick={() => toggleReaction(msg.id, 'like')}
                  className={`p-2 rounded-lg hover:bg-slate-800/60 transition-colors ${
                    likedMap[msg.id] === 'like' ? 'text-[#00d4aa]' : 'hover:text-slate-200'
                  }`}
                  aria-label="J'aime"
                  title="J'aime"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                </button>

                {/* Thumbs Down (Dislike) */}
                <button
                  onClick={() => toggleReaction(msg.id, 'dislike')}
                  className={`p-2 rounded-lg hover:bg-slate-800/60 transition-colors ${
                    likedMap[msg.id] === 'dislike' ? 'text-red-400' : 'hover:text-slate-200'
                  }`}
                  aria-label="Je n'aime pas"
                  title="Je n'aime pas"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 14V2" />
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                  </svg>
                </button>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(msg.content, msg.id)}
                  className="p-2 rounded-lg hover:text-slate-200 hover:bg-slate-800/60 transition-colors relative"
                  aria-label="Copier"
                  title="Copier"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  {copiedId === msg.id && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 text-[#00d4aa] px-2 py-0.5 rounded shadow">
                      Copié !
                    </span>
                  )}
                </button>

                {/* Audio Speaker */}
                <button
                  onClick={() => handleSpeak(msg.content, msg.id)}
                  className={`p-2 rounded-lg hover:bg-slate-800/60 transition-colors ${
                    speakingId === msg.id ? 'text-[#00d4aa]' : 'hover:text-slate-200'
                  }`}
                  aria-label="Écouter"
                  title="Écouter"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                </button>

                {/* More Options (...) */}
                <button
                  className="p-2 rounded-lg hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                  aria-label="Plus d'options"
                  title="Plus d'options"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>

              {/* Disclaimer footer on last assistant message */}
              {isLastMessage && (
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Aether AI est une IA et peut se tromper.
                </p>
              )}
            </div>
          );
        })}

        {/* Loading State - Simple elegant text without box */}
        {isLoading && (
          <div className="flex items-center gap-2.5 py-3 text-slate-400 text-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-ping" />
            <span>Aether AI est en train de réfléchir...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
