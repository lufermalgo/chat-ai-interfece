import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MessageSquare, CornerDownLeft, FileText } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useTranslation } from 'react-i18next';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectConversation }) => {
  const { conversations } = useStore();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
        setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Mock search logic
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  // Mock "Deep" search matches (Simulating finding text inside messages)
  const mockMessageMatches = query.length > 2 ? [
    { id: 'mock-1', convId: conversations[0]?.id || 'c-1', text: `...talking about ${query} in the context of AI...`, date: 'Yesterday' },
    { id: 'mock-2', convId: conversations[0]?.id || 'c-1', text: `...result for ${query} configuration...`, date: 'Last week' },
  ] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-muted/20">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50"
            />
            <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X size={20} />
            </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
            
            {!query && conversations.length > 0 && (
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">{t('chat.recentConversations')}</div>
            )}

            {query && filteredConversations.length === 0 && mockMessageMatches.length === 0 && (
                 <div className="py-12 text-center text-muted-foreground">
                    <p>{t('search.noResults')}</p>
                 </div>
            )}

            {/* Title Matches */}
            {filteredConversations.length > 0 && query && (
                <div className="mb-4">
                     <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">{t('search.conversations')}</div>
                     {filteredConversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => { onSelectConversation(conv.id); onClose(); }}
                            className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare size={18} className="text-muted-foreground group-hover:text-primary" />
                                <span className="text-sm font-medium">{conv.title}</span>
                            </div>
                            <CornerDownLeft size={14} className="opacity-0 group-hover:opacity-50" />
                        </button>
                     ))}
                </div>
            )}

            {/* Mock Message Matches */}
            {mockMessageMatches.length > 0 && (
                <div>
                     <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">{t('search.messages')}</div>
                     {mockMessageMatches.map(match => (
                        <button
                            key={match.id}
                            onClick={() => { onSelectConversation(match.convId); onClose(); }}
                            className="w-full flex items-start px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left group gap-3"
                        >
                            <FileText size={18} className="text-muted-foreground mt-0.5" />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-xs font-medium text-foreground">Matched in chat history</span>
                                    <span className="text-[10px] text-muted-foreground">{match.date}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    "{match.text}"
                                </p>
                            </div>
                        </button>
                     ))}
                </div>
            )}

             {/* Default view (Recent) */}
             {!query && conversations.map(conv => (
                <button
                    key={conv.id}
                    onClick={() => { onSelectConversation(conv.id); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                    <MessageSquare size={18} className="text-muted-foreground" />
                    <span className="text-sm">{conv.title}</span>
                </button>
            ))}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 border-t border-border bg-muted/20 text-[10px] text-muted-foreground flex justify-between">
            <span><strong>ESC</strong> to close</span>
            <span><strong>↵</strong> to select</span>
        </div>
      </div>
    </div>
  );
};