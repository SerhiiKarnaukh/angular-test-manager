import { Injectable } from '@angular/core';

import { buildSocialWebSocketUrl } from '@features/social/data-access/social-websocket.utils';

@Injectable({ providedIn: 'root' })
export class SocialNotificationWebSocketService {
  private socket: WebSocket | null = null;

  connect(userId: number, onMessage: () => void): void {
    this.disconnect();

    if (!userId) {
      return;
    }

    const url = buildSocialWebSocketUrl(`/ws/notification/${userId}/`);
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      const payload = JSON.parse(event.data as string) as { message?: unknown };
      if (payload.message) {
        onMessage();
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
