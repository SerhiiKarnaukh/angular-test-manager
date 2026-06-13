import { TestBed } from '@angular/core/testing';

import { REALTIME_WS_URL } from './ai-lab.models';
import { AiLabRealtimeWebSocketService } from './ai-lab-realtime-websocket.service';

describe('AiLabRealtimeWebSocketService', () => {
  let service: AiLabRealtimeWebSocketService;
  let lastUrl: string | undefined;
  let lastProtocols: string[] | undefined;

  beforeEach(() => {
    class MockWebSocket {
      static readonly OPEN = 1;

      onopen: (() => void) | null = null;
      onmessage: ((event: MessageEvent<string>) => void) | null = null;
      send = vi.fn();
      close = vi.fn();
      readyState = MockWebSocket.OPEN;

      constructor(url: string, protocols: string[]) {
        lastUrl = url;
        lastProtocols = protocols;
      }
    }

    vi.stubGlobal('WebSocket', MockWebSocket);
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiLabRealtimeWebSocketService);
  });

  afterEach(() => {
    service.disconnect();
  });

  function getSocket(): {
    onopen: (() => void) | null;
    onmessage: ((event: MessageEvent<string>) => void) | null;
    send: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  } {
    return (service as unknown as { socket: {
      onopen: (() => void) | null;
      onmessage: ((event: MessageEvent<string>) => void) | null;
      send: ReturnType<typeof vi.fn>;
      close: ReturnType<typeof vi.fn>;
    } }).socket;
  }

  it('connects with ephemeral key protocol', async () => {
    const onAssistantMessage = vi.fn();
    const connectPromise = service.connect('ephemeral-key', onAssistantMessage);

    getSocket().onopen?.();
    getSocket().onmessage?.({
      data: JSON.stringify({ type: 'session.created' }),
    } as MessageEvent<string>);

    await connectPromise;

    expect(lastUrl).toBe(REALTIME_WS_URL);
    expect(lastProtocols).toContain('openai-insecure-api-key.ephemeral-key');
    expect(service.isReady()).toBe(true);
  });

  it('forwards assistant transcript messages', async () => {
    const onAssistantMessage = vi.fn();
    const connectPromise = service.connect('ephemeral-key', onAssistantMessage);

    getSocket().onopen?.();
    getSocket().onmessage?.({
      data: JSON.stringify({ type: 'session.created' }),
    } as MessageEvent<string>);
    await connectPromise;

    getSocket().onmessage?.({
      data: JSON.stringify({
        type: 'response.done',
        response: { output: [{ content: [{ transcript: 'hello back' }] }] },
      }),
    } as MessageEvent<string>);

    expect(onAssistantMessage).toHaveBeenCalledWith('hello back');
  });

  it('sendMessage emits conversation and response events', async () => {
    const connectPromise = service.connect('ephemeral-key', vi.fn());

    getSocket().onopen?.();
    getSocket().onmessage?.({
      data: JSON.stringify({ type: 'session.created' }),
    } as MessageEvent<string>);
    await connectPromise;

    const sent = service.sendMessage('hello');

    expect(sent).toBe(true);
    expect(getSocket().send).toHaveBeenCalledTimes(2);
  });

  it('disconnect closes open socket', async () => {
    const connectPromise = service.connect('ephemeral-key', vi.fn());

    getSocket().onopen?.();
    getSocket().onmessage?.({
      data: JSON.stringify({ type: 'session.created' }),
    } as MessageEvent<string>);
    await connectPromise;

    const socket = getSocket();
    service.disconnect();

    expect(socket.close).toHaveBeenCalled();
    expect(service.isReady()).toBe(false);
  });

  it('resolves connect promise on session.updated', async () => {
    const connectPromise = service.connect('ephemeral-key', vi.fn());

    getSocket().onmessage?.({
      data: JSON.stringify({ type: 'session.updated' }),
    } as MessageEvent<string>);

    await connectPromise;
    expect(service.isReady()).toBe(true);
  });

  it('sendMessage returns false when socket is not ready', () => {
    expect(service.sendMessage('hello')).toBe(false);
  });

  it('ignores unrelated websocket events', async () => {
    const onAssistantMessage = vi.fn();
    const connectPromise = service.connect('ephemeral-key', onAssistantMessage);

    getSocket().onmessage?.({
      data: JSON.stringify({ type: 'session.created' }),
    } as MessageEvent<string>);
    await connectPromise;

    getSocket().onmessage?.({
      data: JSON.stringify({ type: 'response.audio.delta' }),
    } as MessageEvent<string>);

    expect(onAssistantMessage).not.toHaveBeenCalled();
  });
});
