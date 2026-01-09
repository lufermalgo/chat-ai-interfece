export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
}

export type Language = 'en' | 'es';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  language: Language;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  preferences: UserPreferences;
}

export interface BrandingConfig {
  logoUrl: string;
  appName: string;
  loginSubtitle: string; // New customization field
  welcomeHtml: string; // Rich text welcome message
  loginBackgroundUrl: string; // Image for login screen
  primaryColor: string; // HSL value e.g. "221 83% 53%"
  radius: string; // border radius e.g. "0.5rem"
}

export interface InterfaceConfig {
  enableMic: boolean;
  enableFileUpload: boolean;
  enableSearchGrounding: boolean;
  enableStreaming: boolean;
  disclaimerText: string;
  // inputPlaceholder removed
}

export interface AppConfig {
  backendUrl: string;
  customHeaders: Record<string, string>;
  branding: BrandingConfig;
  interface: InterfaceConfig;
  defaultLanguage: Language; // Global default
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Map conversation IDs to their message history
export type MessageMap = Record<string, Message[]>;