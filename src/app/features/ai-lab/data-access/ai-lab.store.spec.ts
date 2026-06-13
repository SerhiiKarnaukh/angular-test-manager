import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';

import { AiLabRealtimeWebSocketService } from './ai-lab-realtime-websocket.service';
import { OPENAI_QUOTA_EXCEEDED_CODE, parseRealtimeAssistantMessage } from './ai-lab.models';
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
  let alert: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService, LoadingService],
    });

    store = TestBed.inject(AiLabStore);
    httpMock = TestBed.inject(HttpTestingController);
    realtimeWs = TestBed.inject(AiLabRealtimeWebSocketService);
    alert = TestBed.inject(AlertService);
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

  it('sendChatMessage shows api error toast with admin suffix', async () => {
    const promise = store.sendChatMessage('hello');

    const request = httpMock.expectOne('/ai-lab/');
    request.flush({ message: 'Error: upstream failed' }, { status: 500, statusText: 'Server Error' });
    await promise;

    expect(alert.message()?.type).toBe('error');
    expect(alert.message()?.value[0]).toContain('Error: upstream failed');
    expect(alert.message()?.value[0]).toContain('Please contact the site administrator');
  });

  it('sendChatMessage shows quota error toast without admin suffix', async () => {
    const promise = store.sendChatMessage('hello');

    const request = httpMock.expectOne('/ai-lab/');
    request.flush(
      {
        message: 'OpenAI API credits have been exhausted.',
        error_code: OPENAI_QUOTA_EXCEEDED_CODE,
      },
      { status: 402, statusText: 'Payment Required' },
    );
    await promise;

    expect(alert.message()?.type).toBe('error');
    expect(alert.message()?.value).toEqual(['OpenAI API credits have been exhausted.']);
  });

  it('connectRealtimeSocket shows quota error toast', async () => {
    const promise = store.connectRealtimeSocket();

    const request = httpMock.expectOne('/ai-lab/realtime-token/');
    request.flush(
      {
        message: 'OpenAI API credits have been exhausted.',
        error_code: OPENAI_QUOTA_EXCEEDED_CODE,
      },
      { status: 402, statusText: 'Payment Required' },
    );
    await promise;

    expect(alert.message()?.type).toBe('error');
    expect(alert.message()?.value).toEqual(['OpenAI API credits have been exhausted.']);
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
