# NexusAI - Agnostic AI Chat Interface

![NexusAI Banner](https://via.placeholder.com/1200x300?text=NexusAI+Interface)

**NexusAI** es una interfaz de chat moderna, reactiva y totalmente agnóstica al backend, diseñada para conectar con cualquier agente de IA o LLM a través de endpoints HTTP/SSE estándar. 

Construida con **React 19**, **TypeScript** y **Tailwind CSS**, ofrece una experiencia de usuario tipo "ChatGPT/Gemini" lista para producción, permitiendo a las organizaciones exponer sus propios agentes personalizados sin tener que reconstruir la capa de presentación.

---

## 🚀 Características Principales

### 🎨 Experiencia de Usuario (UX)
- **Interfaz Moderna**: Diseño limpio inspirado en Gemini/ChatGPT con soporte nativo para **Modo Oscuro/Claro**.
- **Renderizado Rico**: Soporte completo para **Markdown**, Tablas, Listas y **Resaltado de Sintaxis** para código.
- **Streaming en Tiempo Real**: Visualización de respuestas token por token (tipo máquina de escribir).
- **Internacionalización (i18n)**: Soporte nativo para Inglés (EN) y Español (ES).

### ⚙️ Arquitectura Agnóstica
- **Backend Configurable**: Conecta a cualquier URL de API desde el panel de administración.
- **Gestión de Headers**: Inyecta API Keys o Tokens de autorización dinámicamente (se guardan localmente).
- **Personalización de Marca**: Configura el nombre de la App, Logos, Colores primarios (HSL) y textos de bienvenida sin tocar código.

### 🛡️ Seguridad y Persistencia
- **Sanitización de HTML**: Prevención de ataques XSS en el renderizado de Markdown usando `rehype-sanitize`.
- **Persistencia Local**: El historial de chat y la configuración se guardan automáticamente en el navegador.

---

## 🛠️ Stack Tecnológico

- **Core**: React 19, TypeScript.
- **Estilos**: Tailwind CSS (con variables CSS para theming dinámico).
- **Estado**: Context API + Hooks personalizados.
- **Navegación**: React Router Dom v6+.
- **Utilidades**: 
  - `lucide-react` (Iconografía).
  - `react-markdown` (Renderizado de mensajes).
  - `i18next` (Traducciones).

---

## 📦 Instalación y Ejecución

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/tu-usuario/nexus-ai.git
cd nexus-ai
npm install
```

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🔌 Guía de Integración (Backend)

NexusAI espera que tu backend (el Agente) cumpla con un contrato simple para funcionar correctamente.

### 1. Petición (Request)
La interfaz enviará un `POST` al endpoint configurado en el Admin Panel con el siguiente cuerpo JSON:

```json
{
  "messages": [
    { "role": "user", "content": "Hola, ¿cómo estás?" },
    { "role": "assistant", "content": "Hola, soy NexusAI." },
    { "role": "user", "content": "Cuéntame un chiste." }
  ],
  "stream": true
}
```

### 2. Respuesta (Response)
- **Modo Streaming (Recomendado)**: El backend debe responder con un stream de texto plano o SSE (Server-Sent Events).
- **Modo JSON**: Si `stream: false`, se espera un JSON con la propiedad `content` o `message`.

---

## 📂 Estructura del Proyecto

```
src/
├── components/       # Bloques de construcción de UI
│   ├── chat/         # Componentes específicos del chat (Bubble, Input, Search)
│   └── ui/           # Componentes genéricos (Sidebar, Menus)
├── contexts/         # Estado Global (StoreContext)
├── pages/            # Vistas principales (Login, Chat, Admin)
├── services/         # Lógica de negocio (ChatService, i18n, Theme)
├── types.ts          # Definiciones de TypeScript (Interfaces y Tipos)
└── constants.ts      # Valores por defecto y usuarios Mock
```

---

## ⚙️ Panel de Administración

Accede a `/admin` (o loguéate como administrador) para configurar:

1.  **General**: Idioma por defecto.
2.  **Branding**: 
    - Cambia el logo y fondo del login.
    - Define el color primario de tu marca (formato HSL).
    - Edita el mensaje de bienvenida.
3.  **Conexión**:
    - **Endpoint URL**: La dirección de tu API de Agente.
    - **Headers**: JSON con claves de autenticación (ej: `{"Authorization": "Bearer sk-..."}`).
4.  **Features**: Activa/Desactiva micrófono, subida de archivos o streaming.

---

## 🚧 Roadmap y Estado Actual

El proyecto se encuentra en una fase funcional avanzada. Próximos pasos:

- [ ] **Virtualización**: Implementar `react-virtuoso` para chats con +1000 mensajes.
- [ ] **Auth Real**: Integrar proveedores OAuth (Google, Microsoft) en lugar de Mock.
- [ ] **Adjuntos**: Implementar la lógica de envío de archivos en `chatService`.
- [ ] **Multitenancy**: Soporte para múltiples perfiles de configuración remotos.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.
