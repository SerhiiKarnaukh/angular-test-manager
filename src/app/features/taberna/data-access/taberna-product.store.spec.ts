import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';

import { TabernaProductStore } from './taberna-product.store';

describe('TabernaProductStore', () => {
  let store: TabernaProductStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService],
    });

    store = TestBed.inject(TabernaProductStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads latest products into state', async () => {
    const loadPromise = store.loadLatestProducts();
    const request = httpMock.expectOne('/taberna-store/api/v1/latest-products/');
    request.flush([
      {
        id: 1,
        name: 'Runner',
        description: 'Fast shoes',
        price: 99,
        image: '/img.jpg',
        get_absolute_url: '/taberna-store/category/shoes/runner',
      },
    ]);
    await loadPromise;

    expect(store.latestProducts()).toHaveLength(1);
    expect(store.isLoading()).toBe(false);
  });

  it('loads product detail and clears it', async () => {
    const loadPromise = store.loadProductDetail('shoes', 'runner');
    const request = httpMock.expectOne('/taberna-store/api/v1/products/shoes/runner');
    request.flush({
      product: {
        id: 1,
        name: 'Runner',
        description: 'Fast shoes',
        price: 99,
        image: '/img.jpg',
        get_absolute_url: '/taberna-store/category/shoes/runner',
        productgallery: [],
      },
      variations: { colors: [], sizes: [] },
    });
    await loadPromise;

    expect(store.productDetail().product.name).toBe('Runner');

    store.clearProductDetail();
    expect(store.productDetail().product.name).toBe('');
  });

  it('stores search query and results', async () => {
    const searchPromise = store.search('jacket');
    const request = httpMock.expectOne('/taberna-store/api/v1/products/search/');
    request.flush([]);
    await searchPromise;

    expect(store.query()).toBe('jacket');
    expect(store.searchResults()).toEqual([]);
  });
});
