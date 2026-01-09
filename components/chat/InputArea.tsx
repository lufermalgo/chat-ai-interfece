import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useTranslation } from 'react-i18next';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const { config } = useStore();
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <div className="relative flex flex-col w-full bg-muted/30 border border-input rounded-3xl hover:border-input/80 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200">
        
        {/* Text Area */}
        {/* text-base on mobile prevents iOS zoom on focus. md:text-sm keeps it compact on desktop */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('input.placeholder')}
          rows={1}
          className="w-full bg-transparent text-foreground px-5 py-3.5 md:px-6 md:py-4 pr-12 resize-none focus:outline-none max-h-[200px] overflow-y-auto scrollbar-hide placeholder:text-muted-foreground/70 text-base md:text-sm"
          style={{ minHeight: '52px' }}
        />

        {/* Toolbar */}
        <div className="flex justify-between items-center px-2 pb-2 md:px-3 md:pb-3">
            <div className="flex items-center">
                {config.interface.enableFileUpload && (
                    <button className="p-2.5 md:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors active:scale-95" title={t('input.attach')}>
                        <Paperclip size={20} strokeWidth={1.5} />
                    </button>
                )}
                 {config.interface.enableMic && (
                    <button className="p-2.5 md:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors active:scale-95" title={t('input.mic')}>
                        <Mic size={20} strokeWidth={1.5} />
                    </button>
                )}
            </div>

            <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                title={t('input.send')}
                className={`p-2.5 md:p-2 rounded-full transition-all duration-200 flex items-center justify-center active:scale-95
                    ${input.trim() && !isLoading 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' 
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
            >
                <Send size={18} />
            </button>
        </div>
      </div>
      <div className="text-center mt-2 px-4">
        <p className="text-[10px] text-muted-foreground opacity-60 truncate">
            {config.interface.disclaimerText}
        </p>
      </div>
    </div>
  );
};