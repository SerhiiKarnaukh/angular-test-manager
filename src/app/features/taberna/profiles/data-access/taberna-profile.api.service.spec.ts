import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TabernaProfileApiService } from './taberna-profile.api.service';

describe('TabernaProfileApiService', () => {
  let service: TabernaProfileApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TabernaProfileApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchUserOrders calls orders endpoint', () => {
    service.fetchUserOrders().subscribe();

    const request = httpMock.expectOne('/taberna-profiles/api/v1/orders/');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
