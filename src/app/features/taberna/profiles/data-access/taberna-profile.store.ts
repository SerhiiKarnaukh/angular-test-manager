import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { reportApiError } from '@shared/utils/error.utils';

import { TabernaProfileApiService } from './taberna-profile.api.service';
import { TabernaUserOrder } from './taberna-profile.models';

@Injectable({ providedIn: 'root' })
export class TabernaProfileStore {
  private readonly api = inject(TabernaProfileApiService);
  private readonly alert = inject(AlertService);

  private readonly ordersState = signal<TabernaUserOrder[]>([]);
  private readonly loadingState = signal(false);

  readonly orders = this.ordersState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly hasOrders = computed(() => this.ordersState().length > 0);

  async loadMyOrders(): Promise<void> {
    this.loadingState.set(true);

    try {
      const orders = await firstValueFrom(this.api.fetchUserOrders());
      this.ordersState.set(orders);
    } catch (error) {
      reportApiError(this.alert, error);
    } finally {
      this.loadingState.set(false);
    }
  }
}
