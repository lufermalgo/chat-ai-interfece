import React, { useState, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Server, Palette, Layout, Globe, Check, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Language } from '../types';

// --- Utility Functions for Colors ---

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

// Converts RGB to HSL for Tailwind CSS variables
const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    // Return format: "deg sat% light%" (integers)
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Helper to convert saved HSL string back to Hex for the input
const hslToHex = (hslString: string) => {
    const parts = hslString.split(' ');
    if (parts.length !== 3) return '#000000';
    
    let h = parseInt(parts[0]);
    let s = parseInt(parts[1].replace('%', ''));
    let l = parseInt(parts[2].replace('%', ''));

    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

export const AdminPage: React.FC = () => {
  const { config, updateConfig } = useStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'branding' | 'connection' | 'features' | 'general'>('branding');
  const [isSaved, setIsSaved] = useState(false);
  const [customColor, setCustomColor] = useState('#3b82f6'); // Default blue

  // Local state for forms
  const [formData, setFormData] = useState({
    ...config,
    customHeadersStr: JSON.stringify(config.customHeaders, null, 2)
  });

  // Initialize custom color from config on mount
  useEffect(() => {
     if (config.branding.primaryColor) {
         setCustomColor(hslToHex(config.branding.primaryColor));
     }
  }, []);

  const handleChange = (section: keyof typeof config, key: string, value: any) => {
    setFormData(prev => ({
        ...prev,
        [section]: {
            ...prev[section as any],
            [key]: value
        }
    }));
  };

  const handleSave = () => {
    try {
        const headers = JSON.parse(formData.customHeadersStr);
        updateConfig({
            branding: formData.branding,
            interface: formData.interface,
            backendUrl: formData.backendUrl,
            customHeaders: headers,
            defaultLanguage: formData.defaultLanguage
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
        alert(t('admin.alerts.invalidJson'));
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'loginBackgroundUrl') => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validation
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
          alert(t('admin.alerts.formatNotSupported'));
          return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
          alert(t('admin.alerts.fileTooLarge'));
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
          handleChange('branding', field, reader.result as string);
      };
      reader.readAsDataURL(file);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;
      setCustomColor(hex);
      const rgb = hexToRgb(hex);
      if (rgb) {
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          handleChange('branding', 'primaryColor', hsl);
      }
  };

  // Nav Button Component to avoid repetition and ensure consistency across mobile/desktop
  const NavButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
            ${activeTab === id 
                ? 'bg-accent text-accent-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }
        `}
      >
        <Icon size={18} />
        <span>{label}</span>
      </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      
      {/* Top Bar */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3 md:gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-base md:text-lg font-semibold truncate">{t('admin.title')}</h1>
        </div>
        <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${isSaved ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
        >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span className="hidden md:inline">{isSaved ? t('admin.saved') : t('admin.save')}</span>
        </button>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Navigation - Responsive Hybrid */}
        {/* Mobile: Horizontal Scroll */}
        {/* Desktop: Vertical Sidebar */}
        <nav className="
            w-full lg:w-64 flex lg:flex-col 
            overflow-x-auto lg:overflow-y-auto 
            border-b lg:border-b-0 lg:border-r border-border 
            bg-muted/20 lg:bg-muted/10 
            p-2 lg:p-4 gap-1 lg:space-y-1 
            shrink-0 scrollbar-hide
        ">
             <NavButton id="general" icon={Globe} label={t('admin.tabs.general')} />
             <NavButton id="branding" icon={Palette} label={t('admin.tabs.branding')} />
             <NavButton id="connection" icon={Server} label={t('admin.tabs.connection')} />
             <NavButton id="features" icon={Layout} label={t('admin.tabs.features')} />
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 pb-10">
                
                {activeTab === 'general' && (
                    <>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2">{t('admin.general.title')}</h2>
                            <p className="text-sm md:text-base text-muted-foreground">{t('admin.general.subtitle')}</p>
                        </div>

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">{t('admin.general.defaultLanguage')}</label>
                                <select 
                                    value={formData.defaultLanguage}
                                    onChange={(e) => setFormData(p => ({ ...p, defaultLanguage: e.target.value as Language }))}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                </select>
                                <p className="text-xs text-muted-foreground">{t('admin.general.languageDesc')}</p>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'branding' && (
                    <>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2">{t('admin.branding.title')}</h2>
                            <p className="text-sm md:text-base text-muted-foreground">{t('admin.branding.subtitle')}</p>
                        </div>
                        
                        <div className="grid gap-8">
                            
                            {/* App Name */}
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">{t('admin.branding.appName')}</label>
                                <input 
                                    type="text" 
                                    value={formData.branding.appName}
                                    onChange={(e) => handleChange('branding', 'appName', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Login Subtitle */}
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">{t('admin.branding.loginSubtitle')}</label>
                                <textarea 
                                    value={formData.branding.loginSubtitle}
                                    onChange={(e) => handleChange('branding', 'loginSubtitle', e.target.value)}
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                />
                                <p className="text-xs text-muted-foreground">{t('admin.branding.loginSubtitleHint')}</p>
                            </div>

                            {/* Logos & Images Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Logo Upload */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center justify-between">
                                        {t('admin.branding.logoUrl')}
                                        <span className="text-[10px] text-muted-foreground font-normal">Max 2MB</span>
                                    </label>
                                    
                                    <div className="relative group border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-4 transition-all flex flex-col items-center justify-center h-48 bg-muted/10">
                                        {formData.branding.logoUrl ? (
                                            <>
                                                <div className="absolute top-2 right-2 z-10">
                                                    <button 
                                                        onClick={() => handleChange('branding', 'logoUrl', '')}
                                                        className="p-1.5 bg-background border border-border rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <img 
                                                    src={formData.branding.logoUrl} 
                                                    alt="Logo Preview" 
                                                    className="max-h-full max-w-full object-contain" 
                                                />
                                            </>
                                        ) : (
                                            <div className="text-center text-muted-foreground pointer-events-none">
                                                <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                                <p className="text-xs">{t('admin.branding.noLogo')}</p>
                                            </div>
                                        )}
                                        
                                        <input 
                                            type="file" 
                                            id="logo-upload"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept="image/png, image/jpeg, image/webp"
                                            onChange={(e) => handleImageUpload(e, 'logoUrl')}
                                        />
                                        
                                        {!formData.branding.logoUrl && (
                                            <div className="mt-4 pointer-events-none">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    <Upload size={12} /> {t('admin.branding.uploadFile')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Background Upload */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center justify-between">
                                        {t('admin.branding.backgroundUrl')}
                                        <span className="text-[10px] text-muted-foreground font-normal">Max 2MB</span>
                                    </label>
                                    
                                    <div className="relative group border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-0 overflow-hidden transition-all flex flex-col items-center justify-center h-48 bg-muted/10">
                                        {formData.branding.loginBackgroundUrl ? (
                                            <>
                                                <div className="absolute top-2 right-2 z-10">
                                                    <button 
                                                        onClick={() => handleChange('branding', 'loginBackgroundUrl', '')}
                                                        className="p-1.5 bg-background border border-border rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <img 
                                                    src={formData.branding.loginBackgroundUrl} 
                                                    alt="Background Preview" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </>
                                        ) : (
                                            <div className="text-center text-muted-foreground pointer-events-none p-4">
                                                <Layout className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                                <p className="text-xs">{t('admin.branding.defaultGradient')}</p>
                                            </div>
                                        )}
                                        
                                        <input 
                                            type="file" 
                                            id="bg-upload"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept="image/png, image/jpeg, image/webp"
                                            onChange={(e) => handleImageUpload(e, 'loginBackgroundUrl')}
                                        />

                                        {!formData.branding.loginBackgroundUrl && (
                                            <div className="absolute bottom-4 pointer-events-none">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    <Upload size={12} /> {t('admin.branding.uploadFile')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Clean Color Picker */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Palette size={16} /> 
                                    {t('admin.branding.primaryColor')}
                                </label>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-border rounded-xl bg-card">
                                    {/* The visual color circle */}
                                    <div className="relative size-14 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-border cursor-pointer hover:scale-105 transition-transform shrink-0">
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={handleCustomColorChange}
                                            className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                                            title="Pick a color"
                                        />
                                        <div 
                                            style={{ backgroundColor: customColor }} 
                                            className="w-full h-full"
                                        />
                                    </div>

                                    {/* Text info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className="text-sm font-medium">{t('admin.branding.colorHelpTitle')}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {t('admin.branding.colorHelpDesc')}
                                        </p>
                                    </div>

                                    {/* Hex Code Display */}
                                    <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md font-mono text-sm border border-border shrink-0">
                                        <span className="text-muted-foreground">{t('admin.branding.hexLabel')}</span>
                                        <span className="uppercase">{customColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'connection' && (
                    <>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2">{t('admin.connection.title')}</h2>
                            <p className="text-sm md:text-base text-muted-foreground">{t('admin.connection.subtitle')}</p>
                        </div>
                        
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">{t('admin.connection.endpoint')}</label>
                                <input 
                                    type="url" 
                                    value={formData.backendUrl}
                                    onChange={(e) => setFormData(p => ({ ...p, backendUrl: e.target.value }))}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">{t('admin.connection.headers')}</label>
                                <textarea
                                    value={formData.customHeadersStr}
                                    onChange={(e) => setFormData(p => ({ ...p, customHeadersStr: e.target.value }))}
                                    rows={8}
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                                <p className="text-xs text-muted-foreground">{t('admin.connection.headersHint')}</p>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'features' && (
                    <>
                         <div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2">{t('admin.features.title')}</h2>
                            <p className="text-sm md:text-base text-muted-foreground">{t('admin.features.subtitle')}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium">{t('admin.features.streaming')}</label>
                                    <p className="text-sm text-muted-foreground">{t('admin.features.streamingDesc')}</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={formData.interface.enableStreaming}
                                    onChange={(e) => handleChange('interface', 'enableStreaming', e.target.checked)}
                                    className="h-6 w-6 md:h-5 md:w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium">{t('admin.features.uploads')}</label>
                                    <p className="text-sm text-muted-foreground">{t('admin.features.uploadsDesc')}</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={formData.interface.enableFileUpload}
                                    onChange={(e) => handleChange('interface', 'enableFileUpload', e.target.checked)}
                                    className="h-6 w-6 md:h-5 md:w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium">{t('admin.features.voice')}</label>
                                    <p className="text-sm text-muted-foreground">{t('admin.features.voiceDesc')}</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={formData.interface.enableMic}
                                    onChange={(e) => handleChange('interface', 'enableMic', e.target.checked)}
                                    className="h-6 w-6 md:h-5 md:w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border">
                            <h3 className="text-lg font-semibold mb-4">{t('admin.features.textCustomization')}</h3>
                            <div className="grid gap-4">
                                {/* Removed Input Placeholder */}
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">{t('admin.features.disclaimer')}</label>
                                    <input 
                                        type="text" 
                                        value={formData.interface.disclaimerText}
                                        onChange={(e) => handleChange('interface', 'disclaimerText', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </main>
      </div>
    </div>
  );
};