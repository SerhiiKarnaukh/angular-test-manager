import { TestBed } from '@angular/core/testing';

import { SocialChatWebSocketService } from './social-chat-websocket.service';

describe('SocialChatWebSocketService', () => {
  let service: SocialChatWebSocketService;
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
    service = TestBed.inject(SocialChatWebSocketService);
  });

  afterEach(() => {
    service.disconnect();
  });

  it('connects to chat websocket url', () => {
    service.connect(5, 42, vi.fn());

    expect(lastUrl).toBe('ws://127.0.0.1:8000/ws/social-chat/5/42/');
  });

  it('forwards incoming messages to handler', () => {
    const onMessage = vi.fn();
    service.connect(2, 1, onMessage);

    const socket = (service as unknown as { socket: { onmessage: (event: MessageEvent<string>) => void } }).socket;
    socket.onmessage({
      data: JSON.stringify({ message: { id: 10, body: 'hi' } }),
    } as MessageEvent<string>);

    expect(onMessage).toHaveBeenCalledWith({ id: 10, body: 'hi' });
  });

  it('disconnect closes open socket', () => {
    const close = vi.fn();

    class ClosingMockWebSocket {
      static OPEN = 1;
      close = close;
      onmessage: ((event: MessageEvent<string>) => void) | null = null;

      get readyState(): number {
        return ClosingMockWebSocket.OPEN;
      }
    }

    vi.stubGlobal('WebSocket', ClosingMockWebSocket);
    const localService = TestBed.inject(SocialChatWebSocketService);
    localService.connect(2, 1, vi.fn());
    localService.disconnect();

    expect(close).toHaveBeenCalled();
  });
});
