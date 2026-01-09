import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Message, Role } from '../types';
import { streamMessageToBackend } from '../services/chatService';
import { MessageBubble } from '../components/chat/MessageBubble';
import { InputArea } from '../components/chat/InputArea';
import { Sidebar } from '../components/ui/Sidebar';
import { SearchModal } from '../components/chat/SearchModal';
import { Menu, Bot, StopCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ChatPage: React.FC = () => {
  const { 
      config, 
      activeConversationId, 
      setActiveConversationId, 
      messages: globalMessages,
      addMessageToConversation,
      updateMessageInConversation,
      addConversation
  } = useStore();
  const { t } = useTranslation();
  
  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // Desktop sidebar state
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Derive current messages from global store
  const currentMessages = activeConversationId ? (globalMessages[activeConversationId] || []) : [];

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, isStreaming]);

  const handleSendMessage = async (text: string) => {
    let currentId = activeConversationId;

    // Create conversation if none exists
    if (!currentId) {
        // Use first few words as title
        const title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
        currentId = addConversation(title);
        setActiveConversationId(currentId);
    }

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: Date.now(),
    };

    addMessageToConversation(currentId, newUserMsg);
    setIsStreaming(true);

    // Create placeholder for bot response
    const botMsgId = (Date.now() + 1).toString();
    const newBotMsg: Message = {
        id: botMsgId,
        role: Role.ASSISTANT,
        content: '',
        timestamp: Date.now(),
    };
    addMessageToConversation(currentId, newBotMsg);

    try {
      // Build context (ensure we only send relevant history, maybe limit to last 20?)
      const context = [...(globalMessages[currentId] || []), newUserMsg];
      
      const stream = streamMessageToBackend(context, config);
      let fullContent = "";
      
      for await (const chunk of stream) {
        fullContent += chunk;
        updateMessageInConversation(currentId, botMsgId, fullContent);
      }

    } catch (error) {
       console.error("Stream error", error);
       const errorMsg = `\n\n**${t('chat.errorStream')}**`;
       // We append to whatever content we got before error
       const currentContent = globalMessages[currentId]?.find(m => m.id === botMsgId)?.content || "";
       updateMessageInConversation(currentId, botMsgId, currentContent + errorMsg);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStop = () => {
      setIsStreaming(false);
      // Actual fetch abort logic would go here if we had an AbortController in the service
  };

  return (
    // Use h-[100dvh] (Dynamic Viewport Height) to prevent address bar issues on mobile
    <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden font-sans">
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectConversation={(id) => setActiveConversationId(id)}
      />

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 backdrop-blur-sm ${isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <div 
        className={`
            fixed inset-y-0 left-0 z-40 h-full bg-background border-r border-border overflow-hidden
            transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)] shadow-xl md:shadow-none
            md:relative md:translate-x-0
            ${isMobileSidebarOpen ? 'translate-x-0 w-[85%] max-w-[300px]' : '-translate-x-full w-[85%] max-w-[300px] md:w-auto'}
            ${isDesktopSidebarOpen ? 'md:w-[280px] md:opacity-100' : 'md:w-0 md:opacity-0 md:border-none'}
        `}
      >
        <Sidebar 
            onCloseMobile={() => setIsMobileSidebarOpen(false)} 
            onToggleCollapse={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            onOpenSearch={() => setIsSearchOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full bg-background transition-all duration-300">
        
        {/* Header (Mobile & Desktop Collapsed Trigger) */}
        <header className="flex items-center p-3 md:p-4 absolute top-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-b from-background to-transparent h-20">
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="pointer-events-auto p-2.5 -ml-2 text-muted-foreground hover:text-foreground md:hidden active:scale-95 transition-transform"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Collapsed Trigger (Only visible when desktop sidebar is closed) */}
          <div className={`hidden md:block transition-all duration-500 delay-100 ${!isDesktopSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
             <button 
                onClick={() => setIsDesktopSidebarOpen(true)}
                className="pointer-events-auto p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                title="Expand Sidebar"
             >
               <Menu size={24} />
             </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto pt-14 md:pt-0 scrollbar-thin">
          <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 min-h-full">
            
            {/* Empty State */}
            {currentMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground opacity-50 mt-20">
                    <Bot size={48} className="mb-4" />
                    <p>{t('chat.readyToConnect')}</p>
                </div>
            )}

            {currentMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {isStreaming && currentMessages[currentMessages.length-1]?.role !== Role.ASSISTANT && (
               <div className="flex gap-2 items-center text-muted-foreground text-sm ml-2 animate-pulse mt-4">
                 <Bot size={16} />
                 <span>{t('chat.connecting')}</span>
               </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Input - Sticky Bottom */}
        <div className="w-full z-10 shrink-0">
           {/* Gradient fade to prevent hard cut-off */}
           <div className="h-6 md:h-8 bg-gradient-to-t from-background to-transparent w-full pointer-events-none" />
           <div className="bg-background pb-safe pt-2"> 
                {isStreaming && (
                    <div className="flex justify-center mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <button 
                            onClick={handleStop}
                            className="flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-accent rounded-full text-xs font-medium border border-border transition-colors text-foreground shadow-sm active:scale-95"
                        >
                            <StopCircle size={14} />
                            {t('chat.stopGenerating')}
                        </button>
                    </div>
                )}
                <InputArea onSend={handleSendMessage} isLoading={isStreaming} />
           </div>
        </div>
      </div>
    </div>
  );
};