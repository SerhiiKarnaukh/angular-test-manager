import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TabernaProductApiService } from './taberna-product.api.service';

describe('TabernaProductApiService', () => {
  let service: TabernaProductApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TabernaProductApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchLatestProducts calls list endpoint', () => {
    service.fetchLatestProducts().subscribe();

    const request = httpMock.expectOne('/taberna-store/api/v1/latest-products/');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('fetchCategoryProducts calls category endpoint', () => {
    service.fetchCategoryProducts('shoes').subscribe();

    const request = httpMock.expectOne('/taberna-store/api/v1/products/shoes/');
    expect(request.request.method).toBe('GET');
    request.flush({ name: 'Shoes', products: [] });
  });

  it('fetchProductDetail calls detail endpoint', () => {
    service.fetchProductDetail('shoes', 'runner').subscribe();

    const request = httpMock.expectOne('/taberna-store/api/v1/products/shoes/runner');
    expect(request.request.method).toBe('GET');
    request.flush({ product: {}, variations: {} });
  });

  it('fetchProductCategories calls categories endpoint', () => {
    service.fetchProductCategories().subscribe();

    const request = httpMock.expectOne('/taberna-store/api/v1/product-categories/');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('searchProducts posts query to search endpoint', () => {
    service.searchProducts('jacket').subscribe();

    const request = httpMock.expectOne('/taberna-store/api/v1/products/search/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ query: 'jacket' });
    request.flush([]);
  });
});
