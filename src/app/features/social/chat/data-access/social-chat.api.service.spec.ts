import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SocialChatApiService } from './social-chat.api.service';

describe('SocialChatApiService', () => {
  let service: SocialChatApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SocialChatApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchConversations calls list endpoint', () => {
    service.fetchConversations().subscribe();

    const request = httpMock.expectOne('/api/social-chat/');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('fetchChatMessages calls conversation endpoint', () => {
    service.fetchChatMessages(3).subscribe();

    const request = httpMock.expectOne('/api/social-chat/3/');
    expect(request.request.method).toBe('GET');
    request.flush({ id: 3, messages: [] });
  });

  it('sendChatMessage posts message body', () => {
    service.sendChatMessage(9, 'hello').subscribe();

    const request = httpMock.expectOne('/api/social-chat/9/send/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ body: 'hello' });
    request.flush({});
  });
});
