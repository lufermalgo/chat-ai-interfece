import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import { SquarePen, MessageSquare, Menu, Search, ChevronRight } from 'lucide-react';
import { UserProfileMenu } from './UserProfileMenu';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile, onToggleCollapse, onOpenSearch }) => {
  const { conversations, activeConversationId, setActiveConversationId, config } = useStore();
  const { t } = useTranslation();

  const handleNewChat = () => {
    setActiveConversationId(null);
    onCloseMobile();
  };

  const handleSelectChat = (id: string) => {
    setActiveConversationId(id);
    onCloseMobile();
  };

  return (
    // Width is handled by the parent container now for responsiveness.
    // Use h-full and flex column to fill the space.
    <div className="flex flex-col h-full bg-muted/20 md:bg-background border-r border-border md:border-transparent w-full">
      
      {/* Top Header Row: Menu & Search */}
      <div className="flex items-center justify-between px-3 py-3 mt-1 md:mt-2">
        <button 
            onClick={onToggleCollapse}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors hidden md:block"
            title="Collapse Sidebar"
        >
            <Menu size={20} />
        </button>
        {/* On Mobile, we might want a close button or just rely on the overlay click/swipe (not implemented yet) */}
        {/* For now, mobile users click the overlay to close */}
        <span className="md:hidden text-sm font-semibold px-2 text-muted-foreground">
            Menu
        </span>
        
        <button 
            onClick={onOpenSearch}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            title="Search History"
        >
            <Search size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-4 pt-2">
        <button 
            onClick={handleNewChat}
            className="flex items-center gap-3 w-full px-4 py-3 bg-muted/40 hover:bg-muted/80 text-foreground rounded-2xl transition-all duration-300 font-medium text-sm group text-left hover:shadow-sm active:scale-95"
        >
          <SquarePen size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="opacity-90">{t('chat.newChat')}</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 px-3">
        
        {/* "Mis cosas" / My Things Section Header */}
        <div className="mb-2 mt-2">
            <button className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider opacity-90 hover:bg-muted/30 rounded-lg transition-colors group">
                <span>{t('chat.recentConversations')}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>

        {/* Conversation List */}
        <div className="space-y-0.5">
            {conversations.map((conv) => (
            <button
                key={conv.id}
                onClick={() => handleSelectChat(conv.id)}
                className={`w-full text-left px-3 py-3 md:py-2 rounded-lg text-sm flex items-center gap-3 transition-colors duration-200 group
                ${activeConversationId === conv.id 
                    ? 'bg-muted/80 text-foreground font-medium' 
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
            >
                {/* Only show icon if active or on hover to keep it clean */}
                <MessageSquare size={16} className={`shrink-0 transition-opacity duration-200 ${activeConversationId === conv.id ? 'text-foreground opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                <span className={`truncate transition-all duration-300 ${activeConversationId !== conv.id ? '-ml-7 group-hover:ml-0' : ''}`}>{conv.title}</span>
            </button>
            ))}
        </div>
      </div>

      {/* User Section (Fixed Bottom) */}
      <div className="p-3 border-t border-border/40 mt-auto bg-background/50 backdrop-blur-sm pb-safe">
        <UserProfileMenu />
      </div>
    </div>
  );
};