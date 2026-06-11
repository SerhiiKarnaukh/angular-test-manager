import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';

import { apiBaseUrlInterceptor } from './api-base-url.interceptor';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: AuthService;

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('retries once after refreshing token on 401', async () => {
    TestBed.resetTestingModule();
    localStorage.setItem('access', 'old-access');
    localStorage.setItem('refresh', 'refresh-token');

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([apiBaseUrlInterceptor, jwtInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    auth = TestBed.inject(AuthService);

    const responsePromise = firstValueFrom(http.get('/api/social-posts/'));

    const firstRequest = httpMock.expectOne('http://127.0.0.1:8000/api/social-posts/');
    expect(firstRequest.request.headers.get('Authorization')).toBe('Bearer old-access');
    firstRequest.flush(null, { status: 401, statusText: 'Unauthorized' });

    const refreshRequest = httpMock.expectOne('http://127.0.0.1:8000/api/v1/token/refresh/');
    refreshRequest.flush({ access: 'new-access', refresh: 'refresh-token' });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const retryRequest = httpMock.expectOne('http://127.0.0.1:8000/api/social-posts/');
    expect(retryRequest.request.headers.get('Authorization')).toBe('Bearer new-access');
    retryRequest.flush({ results: [] });

    const response = await responsePromise;
    expect(response).toEqual({ results: [] });
    expect(auth.accessToken()).toBe('new-access');
  });
});
