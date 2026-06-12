import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';

import { SocialChatStore } from './social-chat.store';

describe('SocialChatStore', () => {
  let store: SocialChatStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    class MockWebSocket {
      static OPEN = 1;
      onmessage: ((event: MessageEvent<string>) => void) | null = null;
      close(): void {
        // noop
      }
      get readyState(): number {
        return MockWebSocket.OPEN;
      }
    }

    vi.stubGlobal('WebSocket', MockWebSocket);

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService],
    });

    store = TestBed.inject(SocialChatStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    store.clearChatData();
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('loads conversations and selects first thread', async () => {
    const loadPromise = store.loadConversations(42);

    httpMock.expectOne('/api/social-chat/').flush([
      { id: 1, modified_at_formatted: '1h', users: [] },
    ]);

    await Promise.resolve();

    httpMock.expectOne('/api/social-chat/1/').flush({ id: 1, messages: [] });
    await loadPromise;

    expect(store.conversations()).toHaveLength(1);
    expect(store.activeConversation().id).toBe(1);
  });

  it('clears empty conversation state when list is empty', async () => {
    const loadPromise = store.loadConversations(42);
    httpMock.expectOne('/api/social-chat/').flush([]);
    await loadPromise;

    expect(store.conversations()).toEqual([]);
    expect(store.activeConversation().id).toBe(0);
  });

  it('sends chat message through api', async () => {
    const loadPromise = store.loadConversations(42);
    httpMock.expectOne('/api/social-chat/').flush([
      { id: 9, modified_at_formatted: '1h', users: [] },
    ]);
    await Promise.resolve();
    httpMock.expectOne('/api/social-chat/9/').flush({ id: 9, messages: [] });
    await loadPromise;

    const sendPromise = store.sendMessage('hello');
    httpMock.expectOne('/api/social-chat/9/send/').flush({});
    await sendPromise;
  });
});
