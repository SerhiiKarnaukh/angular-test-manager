import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { VueAppsApiService } from './vue-apps.api.service';

describe('VueAppsApiService', () => {
  let service: VueAppsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(VueAppsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchApps calls list endpoint', () => {
    service.fetchApps().subscribe();

    const request = httpMock.expectOne('/api/v1/angular-apps/');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('searchApps posts query to search endpoint', () => {
    service.searchApps('taberna').subscribe((apps) => {
      expect(apps).toEqual([]);
    });

    const request = httpMock.expectOne('/api/v1/angular-apps/search/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ query: 'taberna' });
    request.flush([]);
  });

  it('searchApps normalizes projects wrapper response', () => {
    service.searchApps('').subscribe((apps) => {
      expect(apps).toEqual([]);
    });

    const request = httpMock.expectOne('/api/v1/angular-apps/search/');
    request.flush({ projects: [] });
  });
});
