import { AppConfig, User } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  backendUrl: 'https://api.example.com/v1/chat',
  customHeaders: {},
  defaultLanguage: 'es',
  branding: {
    appName: 'NexusAI',
    loginSubtitle: 'Experimenta la próxima generación de agentes inteligentes. Seguro, escalable y adaptado a tus necesidades.',
    logoUrl: '', // Empty means use default text/icon
    loginBackgroundUrl: '', // Empty means use default gradient
    primaryColor: '217 91% 60%', // Default Blue (HSL)
    radius: '0.75rem',
    welcomeHtml: '' // Handled by i18n default now if empty
  },
  interface: {
    enableMic: true,
    enableFileUpload: true,
    enableSearchGrounding: false,
    enableStreaming: true,
    disclaimerText: 'NexusAI puede cometer errores. Verifica la información importante.'
  }
};

export const MOCK_ADMIN_USER: User = {
  id: 'u-1',
  name: 'Admin User',
  email: 'admin@nexus.ai',
  isAdmin: true,
  avatar: 'https://picsum.photos/200/200',
  preferences: {
    theme: 'system',
    language: 'es'
  }
};

export const MOCK_REGULAR_USER: User = {
  id: 'u-2',
  name: 'Jane Doe',
  email: 'jane@example.com',
  isAdmin: false,
  avatar: 'https://picsum.photos/201/201',
  preferences: {
    theme: 'system',
    language: 'es'
  }
};