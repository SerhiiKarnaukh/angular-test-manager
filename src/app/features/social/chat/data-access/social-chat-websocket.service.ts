import { Injectable } from '@angular/core';

import { buildSocialWebSocketUrl } from '@features/social/data-access/social-websocket.utils';

import { SocialChatMessage } from './social-chat.models';

@Injectable({ providedIn: 'root' })
export class SocialChatWebSocketService {
  private socket: WebSocket | null = null;

  connect(
    conversationId: number,
    userId: number,
    onMessage: (message: SocialChatMessage) => void,
  ): void {
    this.disconnect();

    if (!conversationId || !userId) {
      return;
    }

    const url = buildSocialWebSocketUrl(`/ws/social-chat/${conversationId}/${userId}/`);
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      const payload = JSON.parse(event.data as string) as { message?: SocialChatMessage | null };
      if (payload.message) {
        onMessage(payload.message);
      }
    };
  }

  disconnect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }

    this.socket = null;
  }
}
