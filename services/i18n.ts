import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      auth: {
        signInTitle: 'Sign in to your account',
        subtitle: 'Enter your details to access the platform.',
        standardUser: 'Standard User',
        admin: 'Admin',
        email: 'Email',
        password: 'Password',
        signInButton: 'Sign In',
        orContinueWith: 'Or continue with'
      },
      chat: {
        newChat: 'New Chat',
        recentConversations: 'Recent Conversations',
        connecting: 'Connecting...',
        stopGenerating: 'Stop generating',
        agent: 'Agent',
        you: 'You',
        copyToClipboard: 'Copy to clipboard',
        welcomeMessage: "# Welcome to NexusAI\n\nI am your agnostic AI interface. I can connect to any agent backend you configure.\n\n**Features enabled:**\n- Markdown support\n- Code highlighting\n- Streaming support",
        restoredSession: 'Restored session for conversation',
        readyToConnect: 'Hello! I am ready to connect to your agent.',
        errorStream: 'Error: Stream interrupted.',
        mockResponse: 'I received your message: "{{message}}".\n\nI am currently operating in **Mock Mode** because the backend URL is set to default.\n\n**Streaming is {{streaming}}**.\n\nPlease configure a valid endpoint in the Admin Dashboard.',
        mockCode: 'Here is a **React** component example for you:',
        mockTable: 'Sure, here is some data:'
      },
      input: {
        placeholder: 'Message Agent...',
        attach: 'Attach file',
        mic: 'Use Microphone',
        send: 'Send message'
      },
      search: {
        placeholder: 'Search chats...',
        noResults: 'No results found.',
        conversations: 'Conversations',
        messages: 'Messages (Simulated)',
        open: 'Open'
      },
      admin: {
        title: 'Platform Configuration',
        save: 'Save Changes',
        saved: 'Saved',
        alerts: {
            invalidJson: 'Invalid JSON for headers',
            formatNotSupported: 'Format not supported. Please use PNG, JPG or WebP.',
            fileTooLarge: 'File is too large. Max size is 2MB.'
        },
        tabs: {
          branding: 'Branding & Theme',
          connection: 'Agent Connection',
          features: 'Interface Features',
          general: 'General & Localization'
        },
        branding: {
          title: 'Brand Identity',
          subtitle: 'Customize how the platform looks for your users.',
          appName: 'Application Name',
          loginSubtitle: 'Login Welcome Message',
          loginSubtitleHint: 'This text appears below the logo on the login screen. Useful for welcome banners or organization descriptions.',
          logoUrl: 'Logo URL',
          backgroundUrl: 'Login Background URL',
          theming: 'Theming',
          primaryColor: 'Primary Color (HSL)',
          radius: 'Border Radius',
          uploadFile: 'Upload File',
          noLogo: 'No logo uploaded',
          defaultGradient: 'Default gradient',
          colorHelpTitle: 'Main Brand Color',
          colorHelpDesc: 'Click the circle to select your brand\'s primary color.',
          hexLabel: 'HEX'
        },
        connection: {
          title: 'Backend Configuration',
          subtitle: 'Manage how the interface connects to your AI agent.',
          endpoint: 'Endpoint URL',
          headers: 'Custom Headers (JSON)',
          headersHint: 'Use this to pass API Keys or Authorization tokens safely.'
        },
        features: {
          title: 'Interface Features',
          subtitle: 'Toggle capabilities available to your users.',
          streaming: 'Streaming Responses',
          streamingDesc: 'Typewriter effect for messages.',
          uploads: 'File Uploads',
          uploadsDesc: 'Allow users to attach documents/images.',
          voice: 'Voice Input',
          voiceDesc: 'Enable microphone button.',
          textCustomization: 'Text Customization',
          disclaimer: 'Footer Disclaimer'
        },
        general: {
            title: 'General Settings',
            subtitle: 'Configure platform defaults and localization.',
            defaultLanguage: 'Default Language',
            languageDesc: 'New users will see the interface in this language.'
        }
      },
      user: {
        administrator: 'Administrator',
        platformSettings: 'Platform Settings',
        themePreference: 'Theme Preference',
        languagePreference: 'Language',
        signOut: 'Sign Out'
      }
    }
  },
  es: {
    translation: {
      auth: {
        signInTitle: 'Inicia sesión en tu cuenta',
        subtitle: 'Ingresa tus detalles para acceder a la plataforma.',
        standardUser: 'Usuario Estándar',
        admin: 'Admin',
        email: 'Correo electrónico',
        password: 'Contraseña',
        signInButton: 'Iniciar Sesión',
        orContinueWith: 'O continuar con'
      },
      chat: {
        newChat: 'Nuevo Chat',
        recentConversations: 'Conversaciones Recientes',
        connecting: 'Conectando...',
        stopGenerating: 'Detener generación',
        agent: 'Agente',
        you: 'Tú',
        copyToClipboard: 'Copiar al portapapeles',
        welcomeMessage: "# Bienvenido a NexusAI\n\nSoy tu interfaz de IA agnóstica. Puedo conectarme a cualquier backend de agente que configures.\n\n**Funciones habilitadas:**\n- Soporte Markdown\n- Resaltado de código\n- Soporte de Streaming",
        restoredSession: 'Sesión restaurada para la conversación',
        readyToConnect: '¡Hola! Estoy listo para conectar con tu agente.',
        errorStream: 'Error: Transmisión interrumpida.',
        mockResponse: 'Recibí tu mensaje: "{{message}}".\n\nActualmente estoy operando en **Modo Simulado (Mock)** porque la URL del backend está configurada por defecto.\n\n**El streaming está {{streaming}}**.\n\nPor favor configura un endpoint válido en el Panel Administrativo.',
        mockCode: 'Aquí tienes un ejemplo de componente **React** para ti:',
        mockTable: 'Claro, aquí tienes algunos datos:'
      },
      input: {
        placeholder: 'Mensaje a NexusAI...',
        attach: 'Adjuntar archivo',
        mic: 'Usar micrófono',
        send: 'Enviar mensaje'
      },
      search: {
        placeholder: 'Buscar chats...',
        noResults: 'No se encontraron resultados.',
        conversations: 'Conversaciones',
        messages: 'Mensajes (Simulados)',
        open: 'Abrir'
      },
      admin: {
        title: 'Configuración de Plataforma',
        save: 'Guardar Cambios',
        saved: 'Guardado',
        alerts: {
            invalidJson: 'JSON inválido para headers',
            formatNotSupported: 'Formato no soportado. Usa PNG, JPG o WebP.',
            fileTooLarge: 'El archivo es muy grande. Máximo 2MB.'
        },
        tabs: {
          branding: 'Marca y Tema',
          connection: 'Conexión Agente',
          features: 'Funciones Interfaz',
          general: 'General e Idioma'
        },
        branding: {
          title: 'Identidad de Marca',
          subtitle: 'Personaliza cómo se ve la plataforma para tus usuarios.',
          appName: 'Nombre de Aplicación',
          loginSubtitle: 'Mensaje de Bienvenida (Login)',
          loginSubtitleHint: 'Este texto aparecerá debajo del logo en la pantalla de login. Útil para descripciones de la organización.',
          logoUrl: 'URL del Logo',
          backgroundUrl: 'URL Fondo Login',
          theming: 'Temas',
          primaryColor: 'Color Primario (HSL)',
          radius: 'Radio de Borde',
          uploadFile: 'Cargar Archivo',
          noLogo: 'Sin logo cargado',
          defaultGradient: 'Gradiente por defecto',
          colorHelpTitle: 'Color Principal de Marca',
          colorHelpDesc: 'Haz clic en el círculo para seleccionar el color primario.',
          hexLabel: 'HEX'
        },
        connection: {
          title: 'Configuración Backend',
          subtitle: 'Gestiona la conexión con tu agente de IA.',
          endpoint: 'URL del Endpoint',
          headers: 'Headers Personalizados (JSON)',
          headersHint: 'Usa esto para pasar API Keys o tokens de forma segura.'
        },
        features: {
          title: 'Funciones de Interfaz',
          subtitle: 'Habilita capacidades disponibles para tus usuarios.',
          streaming: 'Respuestas en Streaming',
          streamingDesc: 'Efecto de máquina de escribir en mensajes.',
          uploads: 'Subida de Archivos',
          uploadsDesc: 'Permite adjuntar documentos/imágenes.',
          voice: 'Entrada de Voz',
          voiceDesc: 'Habilita el botón de micrófono.',
          textCustomization: 'Personalización de Texto',
          disclaimer: 'Disclaimer del Pie de Página'
        },
        general: {
            title: 'Configuración General',
            subtitle: 'Configura valores por defecto y localización.',
            defaultLanguage: 'Idioma por Defecto',
            languageDesc: 'Los nuevos usuarios verán la interfaz en este idioma.'
        }
      },
      user: {
        administrator: 'Administrador',
        platformSettings: 'Ajustes de Plataforma',
        themePreference: 'Preferencia de Tema',
        languagePreference: 'Idioma',
        signOut: 'Cerrar Sesión'
      }
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Set default to Spanish
    fallbackLng: 'es', // Set fallback to Spanish
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;