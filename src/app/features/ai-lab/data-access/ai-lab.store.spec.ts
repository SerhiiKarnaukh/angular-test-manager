import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';

import { AiLabRealtimeWebSocketService } from './ai-lab-realtime-websocket.service';
import { parseRealtimeAssistantMessage } from './ai-lab.models';
import { AiLabStore } from './ai-lab.store';

describe('parseRealtimeAssistantMessage', () => {
  it('returns transcript from response.done payload', () => {
    const message = parseRealtimeAssistantMessage({
      type: 'response.done',
      response: { output: [{ content: [{ transcript: 'hello back' }] }] },
    });

    expect(message).toBe('hello back');
  });

  it('returns text fallback from response.done payload', () => {
    const message = parseRealtimeAssistantMessage({
      type: 'response.done',
      response: { output: [{ content: [{ text: 'text reply' }] }] },
    });

    expect(message).toBe('text reply');
  });
});

describe('AiLabStore', () => {
  let store: AiLabStore;
  let httpMock: HttpTestingController;
  let realtimeWs: AiLabRealtimeWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService, LoadingService],
    });

    store = TestBed.inject(AiLabStore);
    httpMock = TestBed.inject(HttpTestingController);
    realtimeWs = TestBed.inject(AiLabRealtimeWebSocketService);
  });

  afterEach(() => {
    httpMock.verify();
    store.disconnectRealtimeSocket();
  });

  it('sendChatMessage stores response message', async () => {
    const promise = store.sendChatMessage('hello');

    const request = httpMock.expectOne('/ai-lab/');
    request.flush({ message: 'AI says hi' });
    await promise;

    expect(store.message()).toBe('AI says hi');
  });

  it('sendChatMessage stores api error message', async () => {
    const promise = store.sendChatMessage('hello');

    const request = httpMock.expectOne('/ai-lab/');
    request.flush({ message: 'Quota exceeded' }, { status: 429, statusText: 'Too Many Requests' });
    await promise;

    expect(store.errorMessage()).toContain('Quota exceeded');
  });

  it('generateImage stores image url', async () => {
    const promise = store.generateImage('draw cat');

    const request = httpMock.expectOne('/ai-lab/image-generator/');
    request.flush({ message: 'https://img.test/a.png' });
    await promise;

    expect(store.imageUrl()).toBe('https://img.test/a.png');
  });

  it('uploadPromptImages appends uploaded urls', async () => {
    const promise = store.uploadPromptImages([
      { file: new File(['x'], 'cat.png', { type: 'image/png' }) },
    ]);

    const request = httpMock.expectOne('/ai-lab/upload-vision-images/');
    request.flush({ uploaded_images: ['https://cdn.test/new.png'] });
    await promise;

    expect(store.promptImages()).toEqual(['https://cdn.test/new.png']);
  });

  it('sendRealtimeMessage appends user message and uses websocket', async () => {
    vi.spyOn(realtimeWs, 'isReady').mockReturnValue(true);
    const sendMessage = vi.spyOn(realtimeWs, 'sendMessage').mockReturnValue(true);

    await store.sendRealtimeMessage('hello');

    expect(store.realtimeMessages()).toEqual([{ sender: 'me', message: 'hello' }]);
    expect(sendMessage).toHaveBeenCalledWith('hello');
  });
});
