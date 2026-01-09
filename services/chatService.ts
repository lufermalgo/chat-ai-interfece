import { Message, AppConfig } from '../types';
import i18n from './i18n';

/**
 * Agent Connector Service
 * Handles communication with the agnostic backend.
 */

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generator function that streams the response from the backend.
 * Handles both Mock mode and Real HTTP/SSE connections.
 */
export async function* streamMessageToBackend(
  messages: Message[], 
  config: AppConfig
): AsyncGenerator<string, void, unknown> {
  const { backendUrl, customHeaders } = config;
  const { enableStreaming } = config.interface;

  // --- MOCK MODE ---
  if (backendUrl.includes('api.example.com')) {
    await delay(500); // Initial latency simulation

    const lastMsg = messages[messages.length - 1].content.toLowerCase();
    let responseText = "";

    if (lastMsg.includes('code')) {
      responseText = `${i18n.t('chat.mockCode')}
\`\`\`tsx
import React from 'react';

export const Button = ({ children }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition">
    {children}
  </button>
);
\`\`\`
`;
    } else if (lastMsg.includes('table')) {
      responseText = `${i18n.t('chat.mockTable')}
| ID | Name | Role | Status |
|----|------|------|--------|
| 1  | User | Admin| Active |
| 2  | Bot  | AI   | Online |
| 3  | Guest| User | Offline|
`;
    } else {
      responseText = i18n.t('chat.mockResponse', { 
        message: messages[messages.length - 1].content,
        streaming: enableStreaming ? 'ON' : 'OFF'
      });
    }

    // Simulate streaming by yielding chunks
    if (enableStreaming) {
      const chunkSize = 5;
      for (let i = 0; i < responseText.length; i += chunkSize) {
        yield responseText.slice(i, i + chunkSize);
        await delay(15 + Math.random() * 20); // Random typing delay
      }
    } else {
      yield responseText;
    }
    return;
  }

  // --- REAL BACKEND MODE ---
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders
      },
      body: JSON.stringify({
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: enableStreaming
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend Error: ${response.status} ${response.statusText}`);
    }

    if (enableStreaming && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // Assume the backend sends raw text chunks or SSE lines. 
        // For a generic implementation, we yield the raw chunk text.
        // A specific implementation might need to parse "data: {...}" lines if it's strict SSE.
        // Here we assume a direct stream of content for simplicity or handle basic SSE parsing if needed.
        yield chunk;
      }
    } else {
      // Non-streaming response
      const data = await response.json();
      // Handle different common response formats
      const content = data.content || data.message || data.choices?.[0]?.message?.content || JSON.stringify(data);
      yield content;
    }

  } catch (error) {
    console.error("Agent Connector Error:", error);
    yield `\n\n**Connection Error**: Could not reach agent at \`${backendUrl}\`.\nReason: ${(error as Error).message}`;
  }
}