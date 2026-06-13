import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AiLabApiService } from './ai-lab.api.service';

describe('AiLabApiService', () => {
  let service: AiLabApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AiLabApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sendChatMessage posts question and prompt images', () => {
    service.sendChatMessage('hello', ['img.png']).subscribe();

    const request = httpMock.expectOne('/ai-lab/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      question: 'hello',
      prompt_images: ['img.png'],
    });
    request.flush({ message: 'hi' });
  });

  it('generateImage posts prompt to image endpoint', () => {
    service.generateImage('draw cat').subscribe();

    const request = httpMock.expectOne('/ai-lab/image-generator/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ question: 'draw cat' });
    request.flush({ message: 'https://img.test/a.png' });
  });

  it('generateVoice posts prompt to voice endpoint', () => {
    service.generateVoice('say hi').subscribe();

    const request = httpMock.expectOne('/ai-lab/voice-generator/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ question: 'say hi' });
    request.flush({ message: 'https://audio.test/a.mp3' });
  });

  it('downloadImage requests blob response', () => {
    service.downloadImage('cat.png').subscribe();

    const request = httpMock.expectOne('/ai-lab/download-image/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ filename: 'cat.png' });
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['image']));
  });

  it('deleteVisionImage sends filename in request body', () => {
    service.deleteVisionImage('cat.png').subscribe();

    const request = httpMock.expectOne('/ai-lab/delete-vision-image/');
    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toEqual({ filename: 'cat.png' });
    request.flush({});
  });

  it('uploadVisionImages posts multipart form data', () => {
    const formData = new FormData();
    service.uploadVisionImages(formData).subscribe();

    const request = httpMock.expectOne('/ai-lab/upload-vision-images/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(formData);
    request.flush({ uploaded_images: ['https://cdn.test/new.png'] });
  });

  it('fetchRealtimeToken posts to realtime-token endpoint', () => {
    service.fetchRealtimeToken().subscribe();

    const request = httpMock.expectOne('/ai-lab/realtime-token/');
    expect(request.request.method).toBe('POST');
    request.flush({ client_secret: { value: 'ephemeral-key' } });
  });
});
