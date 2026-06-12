import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TabernaProfileStore } from './taberna-profile.store';

describe('TabernaProfileStore', () => {
  let store: TabernaProfileStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    store = TestBed.inject(TabernaProfileStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('loads orders into state', async () => {
    const loadPromise = store.loadMyOrders();
    const request = httpMock.expectOne('/taberna-profiles/api/v1/orders/');
    request.flush([
      {
        id: 1,
        order_number: '100',
        created_at: '2026-01-01',
        tax: 10,
        order_total: 110,
        order_products: [],
      },
    ]);
    await loadPromise;

    expect(store.orders()).toHaveLength(1);
    expect(store.hasOrders()).toBe(true);
    expect(store.isLoading()).toBe(false);
  });
});
