import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  OrderPaymentStatus,
  PlaceOrderPayload,
  PlaceOrderSessionResponse,
  StripeActionType,
} from './taberna-order.models';

const BASE_URL = '/taberna-orders/api/v1';

@Injectable({ providedIn: 'root' })
export class TabernaOrdersApiService {
  private readonly http = inject(HttpClient);

  placeStripeOrder(
    payload: PlaceOrderPayload,
    type: StripeActionType,
  ): Observable<PlaceOrderSessionResponse | Record<string, never>> {
    const url =
      type === 'session'
        ? `${BASE_URL}/place_order_stripe_session/`
        : `${BASE_URL}/place_order_stripe_charge/`;

    return this.http.post<PlaceOrderSessionResponse | Record<string, never>>(url, payload);
  }

  reportOrderPaymentStatus(status: OrderPaymentStatus, stripeSessionId: string): Observable<void> {
    const url =
      status === 'success'
        ? `${BASE_URL}/order_payment_success/`
        : `${BASE_URL}/order_payment_failed/`;

    return this.http.post<void>(url, { stripe_session_id: stripeSessionId });
  }
}
