import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { LogOut, Sun, Moon, Monitor, Settings, ChevronRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Language, ThemeMode } from '../../types';

export const UserProfileMenu: React.FC = () => {
  const { auth, updateUserPreferences, logout } = useStore();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (mode: ThemeMode) => {
    updateUserPreferences({ theme: mode });
  };

  const handleLanguageChange = (lang: Language) => {
    updateUserPreferences({ language: lang });
  };

  const currentTheme = auth.user?.preferences.theme || 'system';
  const currentLang = auth.user?.preferences.language || 'en';

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group"
      >
        <div className="w-9 h-9 rounded bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
            {auth.user?.name.charAt(0)}
        </div>
        <div className="flex flex-col items-start truncate flex-1">
            <span className="text-sm font-medium text-foreground truncate">{auth.user?.name}</span>
            <span className="text-xs text-muted-foreground truncate">{auth.user?.email}</span>
        </div>
        <ChevronRight size={16} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-popover border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
            
            {/* Header Badge */}
            {auth.user?.isAdmin && (
                <div className="px-3 py-2 bg-muted/50 border-b border-border">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary">{t('user.administrator')}</span>
                </div>
            )}

            {/* Admin Link */}
            {auth.user?.isAdmin && (
               <div className="p-1">
                   <Link 
                     to="/admin" 
                     onClick={() => setIsOpen(false)}
                     className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                   >
                       <Settings size={16} />
                       <span>{t('user.platformSettings')}</span>
                   </Link>
               </div>
            )}

            <div className="h-px bg-border my-0" />

            {/* Theme Selector */}
            <div className="p-3 pb-1">
                <p className="text-xs text-muted-foreground mb-2 px-1">{t('user.themePreference')}</p>
                <div className="flex bg-muted rounded-lg p-1">
                    <button 
                        onClick={() => handleThemeChange('light')}
                        className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-all ${currentTheme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Light Mode"
                    >
                        <Sun size={14} />
                    </button>
                    <button 
                        onClick={() => handleThemeChange('dark')}
                        className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-all ${currentTheme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Dark Mode"
                    >
                        <Moon size={14} />
                    </button>
                    <button 
                        onClick={() => handleThemeChange('system')}
                        className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-all ${currentTheme === 'system' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        title="System"
                    >
                        <Monitor size={14} />
                    </button>
                </div>
            </div>

             {/* Language Selector */}
             <div className="p-3 pt-2">
                <p className="text-xs text-muted-foreground mb-2 px-1">{t('user.languagePreference')}</p>
                <div className="flex bg-muted rounded-lg p-1">
                    <button 
                        onClick={() => handleLanguageChange('en')}
                        className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-all gap-1 ${currentLang === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span>EN</span>
                    </button>
                    <button 
                        onClick={() => handleLanguageChange('es')}
                        className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-all gap-1 ${currentLang === 'es' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span>ES</span>
                    </button>
                </div>
            </div>

            <div className="h-px bg-border my-0" />

            {/* Logout */}
            <div className="p-1">
                <button 
                    onClick={logout}
                    className="flex items-center w-full gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                    <LogOut size={16} />
                    <span>{t('user.signOut')}</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};