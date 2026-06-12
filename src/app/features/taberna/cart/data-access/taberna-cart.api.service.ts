import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  TabernaAddToCartResponse,
  TabernaCart,
} from './taberna-cart.models';

const BASE_URL = '/taberna-cart/api';

@Injectable({ providedIn: 'root' })
export class TabernaCartApiService {
  private readonly http = inject(HttpClient);

  fetchCart(cartId: string | null): Observable<TabernaCart> {
    const params = this.buildCartIdParams(cartId);
    return this.http.get<TabernaCart>(`${BASE_URL}/cart/`, { params });
  }

  addToCart(
    productId: number,
    color: string,
    size: string,
    cartId: string | null,
  ): Observable<TabernaAddToCartResponse> {
    return this.http.post<TabernaAddToCartResponse>(`${BASE_URL}/add-to-cart/${productId}/`, {
      color,
      size,
      cart_id: cartId,
    });
  }

  removeCartLine(productId: number, cartItemId: number, cartId: string | null): Observable<void> {
    const params = this.buildCartIdParams(cartId);
    return this.http.delete<void>(`${BASE_URL}/cart-remove/${productId}/${cartItemId}/`, {
      params,
    });
  }

  removeCartLineFully(
    productId: number,
    cartItemId: number,
    cartId: string | null,
  ): Observable<void> {
    const params = this.buildCartIdParams(cartId);
    return this.http.delete<void>(`${BASE_URL}/cart-item-remove/${productId}/${cartItemId}/`, {
      params,
    });
  }

  private buildCartIdParams(cartId: string | null): HttpParams | undefined {
    if (!cartId) {
      return undefined;
    }

    return new HttpParams().set('cart_id', cartId);
  }
}
