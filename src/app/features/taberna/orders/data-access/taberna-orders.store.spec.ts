import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';

import { TabernaOrdersStore } from './taberna-orders.store';

describe('TabernaOrdersStore', () => {
  let store: TabernaOrdersStore;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AlertService,
      ],
    });

    store = TestBed.inject(TabernaOrdersStore);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('navigates to success after charge order', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const placePromise = store.placeOrderStripe({ stripe_token: 'tok_123' } as never, 'charge');
    const orderRequest = httpMock.expectOne('/taberna-orders/api/v1/place_order_stripe_charge/');
    orderRequest.flush({});
    await Promise.resolve();

    const cartRequest = httpMock.expectOne('/taberna-cart/api/cart/');
    cartRequest.flush({
      cart_items: [],
      quantity: 0,
      total: 0,
      tax: 0,
      grand_total: 0,
    });

    await placePromise;
    expect(navigateSpy).toHaveBeenCalledWith(['/taberna/cart/success']);
  });
});
