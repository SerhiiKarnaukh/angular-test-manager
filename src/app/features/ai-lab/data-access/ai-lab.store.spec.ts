import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';

import { AiLabRealtimeWebSocketService } from './ai-lab-realtime-websocket.service';
import { OPENAI_QUOTA_EXCEEDED_CODE } from './ai-lab.models';
import { AiLabStore } from './ai-lab.store';

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

  it('generateVoice stores audio url', async () => {
    const promise = store.generateVoice('say hello');

    const request = httpMock.expectOne('/ai-lab/voice-generator/');
    request.flush({ message: 'https://audio.test/a.mp3' });
    await promise;

    expect(store.voiceMessage()).toBe('https://audio.test/a.mp3');
  });

  it('generateImage shows error toast on failure', async () => {
    const promise = store.generateImage('draw cat');

    const request = httpMock.expectOne('/ai-lab/image-generator/');
    request.flush({ message: 'Error: model failed' }, { status: 500, statusText: 'Server Error' });
    await promise;

    expect(alert.message()?.type).toBe('error');
    expect(alert.message()?.value[0]).toContain('Error: model failed');
  });

  it('uploadPromptImages skips request when files array is empty', async () => {
    await store.uploadPromptImages([]);

    httpMock.expectNone('/ai-lab/upload-vision-images/');
    expect(store.uploadingImages()).toBe(false);
  });

  it('uploadPromptImages shows error toast on failure', async () => {
    const promise = store.uploadPromptImages([
      { file: new File(['x'], 'cat.png', { type: 'image/png' }) },
    ]);

    const request = httpMock.expectOne('/ai-lab/upload-vision-images/');
    request.flush({ message: 'Error: upload failed' }, { status: 500, statusText: 'Server Error' });
    await promise;

    expect(alert.message()?.type).toBe('error');
    expect(store.uploadingImages()).toBe(false);
  });

  it('deletePromptImage removes image from state', async () => {
    const uploadPromise = store.uploadPromptImages([
      { file: new File(['x'], 'cat.png', { type: 'image/png' }) },
    ]);
    httpMock.expectOne('/ai-lab/upload-vision-images/').flush({
      uploaded_images: ['https://cdn.test/cat.png'],
    });
    await uploadPromise;

    const deletePromise = store.deletePromptImage(0);

    const request = httpMock.expectOne('/ai-lab/delete-vision-image/');
    expect(request.request.body).toEqual({ filename: 'cat.png' });
    request.flush({});
    await deletePromise;

    expect(store.promptImages()).toEqual([]);
  });

  it('deletePromptImage ignores invalid index', async () => {
    await store.deletePromptImage(0);

    httpMock.expectNone('/ai-lab/delete-vision-image/');
  });

  it('downloadImage triggers blob download', async () => {
    const createObjectUrl = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');
    const revokeObjectUrl = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    const promise = store.downloadImage('https://cdn.test/cat.png');

    const request = httpMock.expectOne('/ai-lab/download-image/');
    expect(request.request.body).toEqual({ filename: 'cat.png' });
    request.flush(new Blob(['image-bytes']));
    await promise;

    expect(createObjectUrl).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:url');
  });

  it('shows fallback toast when api error has no message', async () => {
    const promise = store.sendChatMessage('hello');

    const request = httpMock.expectOne('/ai-lab/');
    request.flush({}, { status: 500, statusText: 'Server Error' });
    await promise;

    expect(alert.message()?.value).toEqual(['Request failed. Please try again.']);
  });

  it('connectRealtimeSocket connects websocket on success', async () => {
    const connect = vi.spyOn(realtimeWs, 'connect').mockResolvedValue(undefined);

    const promise = store.connectRealtimeSocket();
    const request = httpMock.expectOne('/ai-lab/realtime-token/');
    request.flush({ client_secret: { value: 'ephemeral-key' } });
    await promise;

    expect(connect).toHaveBeenCalledWith('ephemeral-key', expect.any(Function));
  });

  it('connectRealtimeSocket appends assistant messages from callback', async () => {
    vi.spyOn(realtimeWs, 'connect').mockImplementation(async (_key, onMessage) => {
      onMessage('assistant reply');
    });

    const promise = store.connectRealtimeSocket();
    httpMock.expectOne('/ai-lab/realtime-token/').flush({ client_secret: { value: 'key' } });
    await promise;

    expect(store.realtimeMessages()).toEqual([{ sender: 'chat', message: 'assistant reply' }]);
  });

  it('sendRealtimeMessage connects websocket when not ready', async () => {
    vi.spyOn(realtimeWs, 'isReady')
      .mockReturnValueOnce(false)
      .mockReturnValue(true);
    vi.spyOn(realtimeWs, 'connect').mockResolvedValue(undefined);
    const sendMessage = vi.spyOn(realtimeWs, 'sendMessage').mockReturnValue(true);

    const promise = store.sendRealtimeMessage('hi');
    httpMock.expectOne('/ai-lab/realtime-token/').flush({ client_secret: { value: 'key' } });
    await promise;

    expect(sendMessage).toHaveBeenCalledWith('hi');
    expect(store.realtimeMessages()).toEqual([{ sender: 'me', message: 'hi' }]);
  });

  it('sendRealtimeMessage stops when websocket remains unavailable', async () => {
    vi.spyOn(realtimeWs, 'isReady').mockReturnValue(false);
    vi.spyOn(realtimeWs, 'connect').mockResolvedValue(undefined);
    const sendMessage = vi.spyOn(realtimeWs, 'sendMessage');

    const promise = store.sendRealtimeMessage('hi');
    httpMock.expectOne('/ai-lab/realtime-token/').flush({ client_secret: { value: 'key' } });
    await promise;

    expect(sendMessage).not.toHaveBeenCalled();
    expect(store.realtimeMessages()).toEqual([]);
  });
});
