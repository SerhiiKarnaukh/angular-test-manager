import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { flattenApiErrors } from '@shared/utils/error.utils';

import { TabernaCartApiService } from './taberna-cart.api.service';
import { EMPTY_TABERNA_CART, TabernaCart } from './taberna-cart.models';

const CART_ID_KEY = 'cartId';

@Injectable({ providedIn: 'root' })
export class TabernaCartStore {
  private readonly api = inject(TabernaCartApiService);
  private readonly alert = inject(AlertService);

  private readonly cartState = signal<TabernaCart>(EMPTY_TABERNA_CART);
  private readonly cartIdState = signal<string | null>(localStorage.getItem(CART_ID_KEY));
  private readonly loadingState = signal(false);

  readonly cart = this.cartState.asReadonly();
  readonly cartId = this.cartIdState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly cartQuantity = computed(() => this.cartState().quantity || 0);
  readonly hasItems = computed(() => this.cartState().cart_items.length > 0);

  async loadCart(): Promise<void> {
    await this.runRequest(async () => {
      const cart = await firstValueFrom(this.api.fetchCart(this.cartIdState()));
      this.cartState.set(cart);
    }, { silent: true });
  }

  async addToCart(productId: number, color: string, size: string): Promise<void> {
    await this.runRequest(async () => {
      const response = await firstValueFrom(
        this.api.addToCart(productId, color, size, this.cartIdState()),
      );

      if (response.cart_id) {
        this.setCartId(response.cart_id);
      }
    });
  }

  async decrementLine(productId: number, cartItemId: number): Promise<void> {
    await this.runRequest(async () => {
      await firstValueFrom(
        this.api.removeCartLine(productId, cartItemId, this.cartIdState()),
      );
    });
  }

  async removeLine(productId: number, cartItemId: number): Promise<void> {
    await this.runRequest(async () => {
      await firstValueFrom(
        this.api.removeCartLineFully(productId, cartItemId, this.cartIdState()),
      );
    });
  }

  clearCartId(): void {
    localStorage.removeItem(CART_ID_KEY);
    this.cartIdState.set(null);
  }

  private setCartId(cartId: string): void {
    localStorage.setItem(CART_ID_KEY, cartId);
    this.cartIdState.set(cartId);
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

    console.error(error);
  }
}
