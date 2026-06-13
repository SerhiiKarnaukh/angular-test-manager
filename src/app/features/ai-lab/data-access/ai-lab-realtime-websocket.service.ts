import { Injectable } from '@angular/core';

import { parseRealtimeAssistantMessage, REALTIME_WS_URL } from './ai-lab.models';

@Injectable({ providedIn: 'root' })
export class AiLabRealtimeWebSocketService {
  private socket: WebSocket | null = null;
  private sessionReady = false;

  connect(
    ephemeralKey: string,
    onAssistantMessage: (message: string) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let resolved = false;
      this.disconnect();

      const ws = new WebSocket(REALTIME_WS_URL, [
        'realtime',
        `openai-insecure-api-key.${ephemeralKey}`,
      ]);
      this.socket = ws;

      ws.onopen = () => {
        // Connection established; session events mark readiness below.
      };

      ws.onerror = (event) => {
        if (!resolved) {
          resolved = true;
          reject(event);
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data as string) as {
          type?: string;
          response?: { output?: { content?: { transcript?: string; text?: string }[] }[] };
        };

        if (data.type === 'session.created' || data.type === 'session.updated') {
          this.sessionReady = true;
          if (!resolved) {
            resolved = true;
            resolve();
          }
          return;
        }

        if (data.type === 'error') {
          console.error('Realtime error:', data);
          return;
        }

        const message = parseRealtimeAssistantMessage(data);
        if (message) {
          onAssistantMessage(message);
        }
      };

      ws.onclose = () => {
        this.socket = null;
        this.sessionReady = false;
      };
    });
  }

  sendMessage(question: string): boolean {
    if (!this.isReady()) {
      return false;
    }

    const createEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text: question }],
      },
    };

    this.socket?.send(JSON.stringify(createEvent));
    this.socket?.send(JSON.stringify({ type: 'response.create' }));
    return true;
  }

  isReady(): boolean {
    return this.socket?.readyState === WebSocket.OPEN && this.sessionReady;
  }

  disconnect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }

    this.socket = null;
    this.sessionReady = false;
  }
}
