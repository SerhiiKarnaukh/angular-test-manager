import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { TabernaCartStore } from '@features/taberna/cart/data-access/taberna-cart.store';
import { flattenApiErrors } from '@shared/utils/error.utils';

import { TabernaOrdersApiService } from './taberna-orders.api.service';
import {
  OrderPaymentStatus,
  PlaceOrderPayload,
  PlaceOrderSessionResponse,
  StripeActionType,
} from './taberna-order.models';

@Injectable({ providedIn: 'root' })
export class TabernaOrdersStore {
  private readonly api = inject(TabernaOrdersApiService);
  private readonly cartStore = inject(TabernaCartStore);
  private readonly alert = inject(AlertService);
  private readonly router = inject(Router);

  private readonly loadingState = signal(false);

  readonly isLoading = this.loadingState.asReadonly();

  async placeOrderStripe(payload: PlaceOrderPayload, type: StripeActionType): Promise<void> {
    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.placeStripeOrder(payload, type));

      if (type === 'session') {
        this.redirectToCheckoutSession(response as PlaceOrderSessionResponse);
        return;
      }

      await this.cartStore.loadCart();
      await this.router.navigate(['/taberna/cart/success']);
    });
  }

  async reportOrderStatus(status: OrderPaymentStatus, stripeSessionId: string): Promise<void> {
    await this.runRequest(async () => {
      await firstValueFrom(this.api.reportOrderPaymentStatus(status, stripeSessionId));
      await this.cartStore.loadCart();
    }, { silent: true });
  }

  private redirectToCheckoutSession(response: PlaceOrderSessionResponse): void {
    if (!response.checkout_url) {
      throw new Error('Missing checkout URL');
    }

    window.location.href = response.checkout_url;
  }

  private async runRequest(
    action: () => Promise<void>,
    options: { silent?: boolean } = {},
  ): Promise<void> {
    this.loadingState.set(true);

    try {
      await action();
    } catch (error) {
      if (!options.silent) {
        this.handleError(error);
      } else {
        console.error(error);
      }
    } finally {
      this.loadingState.set(false);
    }
  }

  private handleError(error: unknown): void {
    const body = (error as { error?: Record<string, unknown> })?.error;
    if (body && typeof body === 'object') {
      this.alert.setMessage({ value: flattenApiErrors(body), type: 'error' });
      return;
    }

    this.alert.setMessage({
      value: ['Something went wrong. Please try again'],
      type: 'error',
    });
    console.error(error);
  }
}
