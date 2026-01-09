import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AppConfig, AuthState, Conversation, UserPreferences, Message, MessageMap } from '../types';
import { DEFAULT_CONFIG, MOCK_ADMIN_USER, MOCK_REGULAR_USER } from '../constants';
import { applyTheme } from '../services/themeService';
import i18n from '../services/i18n'; 

interface StoreContextType {
  auth: AuthState;
  config: AppConfig;
  activeConversationId: string | null;
  conversations: Conversation[];
  messages: MessageMap; // Global message store
  login: (asAdmin: boolean) => void;
  logout: () => void;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void;
  setActiveConversationId: (id: string | null) => void;
  addConversation: (title: string) => string;
  deleteConversation: (id: string) => void;
  addMessageToConversation: (convId: string, message: Message) => void;
  updateMessageInConversation: (convId: string, msgId: string, content: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Local Storage Keys
const STORAGE_KEYS = {
  CONFIG: 'nexus_config',
  CONVERSATIONS: 'nexus_conversations',
  MESSAGES: 'nexus_messages',
  AUTH: 'nexus_auth_user' // Storing user for persistence example (be careful with sensitive data)
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State Initialization with Persistence ---
  
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [auth, setAuth] = useState<AuthState>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH);
    return {
      isAuthenticated: !!savedUser,
      user: savedUser ? JSON.parse(savedUser) : null,
    };
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : [{ id: 'c-1', title: 'Project Discussion', updatedAt: Date.now() }];
  });

  const [messages, setMessages] = useState<MessageMap>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : {};
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('c-1');

  // --- Persistence Effects ---

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (auth.user) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth.user));
    } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [auth.user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // --- Logic Effects ---

  useEffect(() => {
    const targetLang = auth.user?.preferences.language || config.defaultLanguage;
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [auth.user?.preferences.language, config.defaultLanguage]);

  useEffect(() => {
    const mode = auth.user?.preferences.theme || 'system';
    applyTheme(config, mode);
  }, [config, auth.user?.preferences.theme]);

  // --- Actions ---

  const login = (asAdmin: boolean) => {
    const user = asAdmin ? MOCK_ADMIN_USER : MOCK_REGULAR_USER;
    setAuth({ isAuthenticated: true, user: user });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
    setActiveConversationId(null);
  };

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({
        ...prev,
        ...newConfig,
        branding: { ...prev.branding, ...(newConfig.branding || {}) },
        interface: { ...prev.interface, ...(newConfig.interface || {}) },
        customHeaders: { ...prev.customHeaders, ...(newConfig.customHeaders || {}) }
    }));
  };

  const updateUserPreferences = (prefs: Partial<UserPreferences>) => {
    if (!auth.user) return;
    setAuth(prev => ({
      ...prev,
      user: prev.user ? {
        ...prev.user,
        preferences: { ...prev.user.preferences, ...prefs }
      } : null
    }));
  };

  const addConversation = (title: string) => {
    const newId = `c-${Date.now()}`;
    const newConv: Conversation = { id: newId, title, updatedAt: Date.now() };
    setConversations(prev => [newConv, ...prev]);
    return newId;
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    // Clean up messages
    setMessages(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
    });
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const addMessageToConversation = (convId: string, message: Message) => {
    setMessages(prev => ({
        ...prev,
        [convId]: [...(prev[convId] || []), message]
    }));
    // Update conversation timestamp
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, updatedAt: Date.now() } : c));
  };

  const updateMessageInConversation = (convId: string, msgId: string, content: string) => {
      setMessages(prev => ({
          ...prev,
          [convId]: (prev[convId] || []).map(m => m.id === msgId ? { ...m, content } : m)
      }));
  };

  return (
    <StoreContext.Provider value={{
      auth,
      config,
      activeConversationId,
      conversations,
      messages, // Exported for persistence reading
      login,
      logout,
      updateConfig,
      updateUserPreferences,
      setActiveConversationId,
      addConversation,
      deleteConversation,
      addMessageToConversation,
      updateMessageInConversation
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};