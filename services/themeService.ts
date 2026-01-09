import { AppConfig, ThemeMode } from '../types';

export const applyTheme = (config: AppConfig, userThemeMode: ThemeMode = 'system') => {
  const root = document.documentElement;

  // Apply Primary Color
  if (config.branding.primaryColor) {
    root.style.setProperty('--primary', config.branding.primaryColor);
    // Rough estimate for foreground contrast
    root.style.setProperty('--primary-foreground', '210 40% 98%');
  }

  // Apply Radius
  if (config.branding.radius) {
    root.style.setProperty('--radius', config.branding.radius);
  }

  // Apply Page Title
  document.title = config.branding.appName || 'NexusAI';

  // Apply Dark/Light Mode
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let isDark = false;
  if (userThemeMode === 'system') {
    isDark = isSystemDark;
  } else {
    isDark = userThemeMode === 'dark';
  }
  
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};