import { TestBed } from '@angular/core/testing';

import { SocialNotificationWebSocketService } from './social-notification-websocket.service';

describe('SocialNotificationWebSocketService', () => {
  let service: SocialNotificationWebSocketService;
  let lastUrl: string | undefined;

  beforeEach(() => {
    class MockWebSocket {
      static OPEN = 1;

      onmessage: ((event: MessageEvent<string>) => void) | null = null;

      constructor(url: string) {
        lastUrl = url;
      }

      close(): void {
        // noop
      }

      get readyState(): number {
        return MockWebSocket.OPEN;
      }
    }

    vi.stubGlobal('WebSocket', MockWebSocket);
    service = TestBed.inject(SocialNotificationWebSocketService);
  });

  afterEach(() => {
    service.disconnect();
  });

  it('connects to notification websocket url', () => {
    service.connect(7, vi.fn());

    expect(lastUrl).toBe('ws://127.0.0.1:8000/ws/notification/7/');
  });

  it('reload handler runs on websocket message', () => {
    const onMessage = vi.fn();
    service.connect(1, onMessage);

    const socket = (service as unknown as { socket: { onmessage: (event: MessageEvent<string>) => void } }).socket;
    socket.onmessage({
      data: JSON.stringify({ message: { id: 1 } }),
    } as MessageEvent<string>);

    expect(onMessage).toHaveBeenCalled();
  });
});
