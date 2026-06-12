import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TabernaCartApiService } from './taberna-cart.api.service';

describe('TabernaCartApiService', () => {
  let service: TabernaCartApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TabernaCartApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchCart calls cart endpoint without cart_id when anonymous', () => {
    service.fetchCart(null).subscribe();

    const request = httpMock.expectOne('/taberna-cart/api/cart/');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush({ cart_items: [], quantity: 0, total: 0, tax: 0, grand_total: 0 });
  });

  it('fetchCart passes cart_id when present', () => {
    service.fetchCart('cart-42').subscribe();

    const request = httpMock.expectOne('/taberna-cart/api/cart/?cart_id=cart-42');
    expect(request.request.method).toBe('GET');
    request.flush({ cart_items: [], quantity: 0, total: 0, tax: 0, grand_total: 0 });
  });

  it('addToCart posts variation payload', () => {
    service.addToCart(7, 'red', 'M', 'cart-1').subscribe();

    const request = httpMock.expectOne('/taberna-cart/api/add-to-cart/7/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ color: 'red', size: 'M', cart_id: 'cart-1' });
    request.flush({ cart_id: 'cart-99' });
  });

  it('removeCartLine deletes one quantity', () => {
    service.removeCartLine(3, 11, 'cart-1').subscribe();

    const request = httpMock.expectOne('/taberna-cart/api/cart-remove/3/11/?cart_id=cart-1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('removeCartLineFully deletes entire line', () => {
    service.removeCartLineFully(3, 11, null).subscribe();

    const request = httpMock.expectOne('/taberna-cart/api/cart-item-remove/3/11/');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
