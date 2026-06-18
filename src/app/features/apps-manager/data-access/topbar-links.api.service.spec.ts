import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TopbarLinksApiService } from './topbar-links.api.service';

describe('TopbarLinksApiService', () => {
  let service: TopbarLinksApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TopbarLinksApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchLinks calls list endpoint and maps short labels', () => {
    service.fetchLinks().subscribe((links) => {
      expect(links).toEqual([
        { key: 'github', url: 'https://github.com', title: 'GitHub', icon_class: 'fab fa-github', ordering: 1 },
      ]);
    });

    const request = httpMock.expectOne('/api/v1/topbar-links/');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        key: 'github',
        url: 'https://github.com',
        title: 'GitHub Account',
        icon_class: 'fab fa-github',
        ordering: 1,
      },
    ]);
  });
});
