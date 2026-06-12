import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';

import { TabernaCartStore } from './taberna-cart.store';

describe('TabernaCartStore', () => {
  let store: TabernaCartStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService],
    });

    store = TestBed.inject(TabernaCartStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('loads cart into state', async () => {
    const loadPromise = store.loadCart();
    const request = httpMock.expectOne('/taberna-cart/api/cart/');
    request.flush({
      cart_items: [],
      quantity: 2,
      total: 100,
      tax: 10,
      grand_total: 110,
    });
    await loadPromise;

    expect(store.cartQuantity()).toBe(2);
    expect(store.isLoading()).toBe(false);
  });

  it('persists cart_id from addToCart response', async () => {
    const addPromise = store.addToCart(1, 'red', 'M');
    const request = httpMock.expectOne('/taberna-cart/api/add-to-cart/1/');
    request.flush({ cart_id: 'guest-cart-1' });
    await addPromise;

    expect(store.cartId()).toBe('guest-cart-1');
    expect(localStorage.getItem('cartId')).toBe('guest-cart-1');
  });

  it('clears cartId from storage', () => {
    localStorage.setItem('cartId', 'guest-cart-1');

    store.clearCartId();

    expect(store.cartId()).toBeNull();
    expect(localStorage.getItem('cartId')).toBeNull();
  });
});
