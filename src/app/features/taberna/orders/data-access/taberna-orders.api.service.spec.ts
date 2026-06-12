import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TabernaOrdersApiService } from './taberna-orders.api.service';

describe('TabernaOrdersApiService', () => {
  let service: TabernaOrdersApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TabernaOrdersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('placeStripeOrder uses session endpoint', () => {
    service.placeStripeOrder({ stripe_token: null } as never, 'session').subscribe();

    const request = httpMock.expectOne('/taberna-orders/api/v1/place_order_stripe_session/');
    expect(request.request.method).toBe('POST');
    request.flush({ checkout_url: 'https://stripe.test/checkout' });
  });

  it('placeStripeOrder uses charge endpoint', () => {
    service.placeStripeOrder({ stripe_token: 'tok_123' } as never, 'charge').subscribe();

    const request = httpMock.expectOne('/taberna-orders/api/v1/place_order_stripe_charge/');
    expect(request.request.method).toBe('POST');
    request.flush({});
  });

  it('reportOrderPaymentStatus posts success session id', () => {
    service.reportOrderPaymentStatus('success', 'sess_123').subscribe();

    const request = httpMock.expectOne('/taberna-orders/api/v1/order_payment_success/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ stripe_session_id: 'sess_123' });
    request.flush(null);
  });

  it('reportOrderPaymentStatus posts failed session id', () => {
    service.reportOrderPaymentStatus('failed', 'sess_456').subscribe();

    const request = httpMock.expectOne('/taberna-orders/api/v1/order_payment_failed/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ stripe_session_id: 'sess_456' });
    request.flush(null);
  });
});
