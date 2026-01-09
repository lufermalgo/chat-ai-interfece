import React, { memo } from 'react';
import { Message, Role } from '../../types';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { User, Bot, Copy, Check, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MessageBubbleProps {
  message: Message;
}

// Optimization: Memoize the bubble to prevent re-renders of list items not changing
export const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message }) => {
  const isUser = message.role === Role.USER;
  const [copied, setCopied] = React.useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8 group`}>
      <div className={`flex max-w-full md:max-w-[85%] lg:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
            isUser 
            ? 'bg-background border-border text-foreground' 
            : 'bg-primary/10 border-primary/20 text-primary'
        }`}>
          {isUser ? <User size={16} className="text-muted-foreground" /> : <Bot size={18} />}
        </div>

        {/* Content Container */}
        <div className={`flex flex-col min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
          
          {/* Metadata & Actions */}
          <div className={`flex items-center gap-2 mb-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
             <span className="text-xs font-medium text-muted-foreground capitalize">{message.role === Role.ASSISTANT ? t('chat.agent') : t('chat.you')}</span>
             {!isUser && (
               <button 
                  onClick={handleCopy} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                  title={t('chat.copyToClipboard')}
               >
                 {copied ? <Check size={12} /> : <Copy size={12} />}
               </button>
             )}
          </div>
          
          {/* Message Body */}
          <div className={`relative px-4 py-3 text-sm md:text-base leading-relaxed overflow-hidden shadow-sm
            ${isUser 
              ? 'bg-secondary text-secondary-foreground rounded-2xl rounded-tr-sm' 
              : 'bg-transparent text-foreground w-full'
            }`}>
              
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-p:leading-7 prose-pre:p-0 prose-pre:bg-transparent">
                <ReactMarkdown
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    p({children}) {
                        return <p className="mb-4 last:mb-0">{children}</p>
                    },
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="my-6 rounded-lg overflow-hidden border border-border bg-card">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <Terminal size={12} className="text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground font-mono">{match[1]}</span>
                                </div>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <code className={`${className} !bg-transparent !p-0 font-mono text-sm`} {...props}>
                                    {children}
                                </code>
                            </div>
                        </div>
                      ) : (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-xs font-mono border border-border" {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({children}: any) {
                        return (
                            <div className="overflow-x-auto my-6 border border-border rounded-lg">
                                <table className="min-w-full divide-y divide-border bg-card">
                                    {children}
                                </table>
                            </div>
                        )
                    },
                    thead({children}: any) {
                        return <thead className="bg-muted">{children}</thead>
                    },
                    th({children}: any) {
                        return <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{children}</th>
                    },
                    tbody({children}: any) {
                        return <tbody className="divide-y divide-border">{children}</tbody>
                    },
                    tr({children}: any) {
                        return <tr className="hover:bg-muted/50 transition-colors">{children}</tr>
                    },
                    td({children}: any) {
                        return <td className="px-4 py-2 whitespace-nowrap text-sm">{children}</td>
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});