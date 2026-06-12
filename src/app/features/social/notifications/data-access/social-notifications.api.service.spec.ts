import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SocialNotificationsApiService } from './social-notifications.api.service';

describe('SocialNotificationsApiService', () => {
  let service: SocialNotificationsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SocialNotificationsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchNotifications calls list endpoint', () => {
    service.fetchNotifications().subscribe();

    const request = httpMock.expectOne('/api/social-notifications/');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('markNotificationRead posts to read endpoint', () => {
    service.markNotificationRead(8).subscribe();

    const request = httpMock.expectOne('/api/social-notifications/read/8/');
    expect(request.request.method).toBe('POST');
    request.flush({});
  });
});
