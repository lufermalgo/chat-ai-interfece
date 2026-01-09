import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Sparkles, ShieldCheck, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LoginPage: React.FC = () => {
  const { login, config } = useStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      
      {/* Left / Background Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted items-center justify-center">
        {config.branding.loginBackgroundUrl ? (
            <>
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img 
                    src={config.branding.loginBackgroundUrl} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </>
        ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        
        <div className="relative z-20 p-12 text-white max-w-lg">
            {config.branding.logoUrl ? (
                 <img src={config.branding.logoUrl} alt="Logo" className="h-16 mb-8 object-contain" />
            ) : (
                <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20">
                    <Sparkles className="text-white" size={40} />
                </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{config.branding.appName}</h1>
            <p className="text-lg opacity-80 leading-relaxed whitespace-pre-wrap">
                {config.branding.loginSubtitle}
            </p>
        </div>
      </div>

      {/* Right / Login Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">
            
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight">{t('auth.signInTitle')}</h2>
                <p className="mt-2 text-muted-foreground">
                    {t('auth.subtitle')}
                </p>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-2 bg-muted p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('user')}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'user' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    {t('auth.standardUser')}
                </button>
                <button 
                    onClick={() => setActiveTab('admin')}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    {t('auth.admin')}
                </button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('auth.email')}</label>
                    <input 
                        type="email" 
                        disabled 
                        value={activeTab === 'admin' ? 'admin@nexus.ai' : 'user@example.com'}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('auth.password')}</label>
                    <input 
                        type="password" 
                        disabled 
                        value="••••••••••••"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <button 
                    onClick={() => login(activeTab === 'admin')}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full gap-2"
                >
                    {activeTab === 'admin' ? <ShieldCheck size={18} /> : <User size={18} />}
                    <span>{t('auth.signInButton')}</span>
                </button>
            </div>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">{t('auth.orContinueWith')}</span></div>
            </div>

            <button 
                onClick={() => login(false)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full gap-2"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Google</span>
            </button>
        </div>
      </div>
    </div>
  );
};