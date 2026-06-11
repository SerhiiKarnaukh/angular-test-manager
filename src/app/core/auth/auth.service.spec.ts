import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('stores tokens on login', async () => {
    const loginPromise = service.login({
      email: 'user@example.com',
      password: 'secret12',
      login_source: 'taberna',
      activeApp: 'taberna',
    });

    const request = httpMock.expectOne('/taberna-profiles/api/v1/token/');
    request.flush({ access: 'access-token', refresh: 'refresh-token' });

    await loginPromise;

    expect(localStorage.getItem('access')).toBe('access-token');
    expect(localStorage.getItem('refresh')).toBe('refresh-token');
    expect(localStorage.getItem('active_app')).toBe('taberna');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('clears tokens on logout', () => {
    localStorage.setItem('access', 'token');
    localStorage.setItem('refresh', 'refresh');

    service.logout();

    expect(localStorage.getItem('access')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('refreshes access token', async () => {
    TestBed.resetTestingModule();
    localStorage.setItem('refresh', 'refresh-token');

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    const refreshPromise = service.refreshSession();
    const request = httpMock.expectOne('/api/v1/token/refresh/');
    request.flush({ access: 'new-access', refresh: 'refresh-token' });

    const refreshed = await refreshPromise;

    expect(refreshed).toBe(true);
    expect(localStorage.getItem('access')).toBe('new-access');
  });
});
