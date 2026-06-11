import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { flattenApiErrors } from '@shared/utils/error.utils';

import { VueApp } from './vue-app.models';
import { VueAppsApiService } from './vue-apps.api.service';

@Injectable({ providedIn: 'root' })
export class AppsManagerStore {
  private readonly api = inject(VueAppsApiService);
  private readonly alert = inject(AlertService);

  private readonly appsState = signal<VueApp[]>([]);
  private readonly loadingState = signal(false);
  private readonly queryState = signal('');

  readonly apps = this.appsState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly query = this.queryState.asReadonly();

  async loadApps(): Promise<void> {
    await this.runRequest(async () => {
      const apps = await firstValueFrom(this.api.fetchApps());
      this.appsState.set(apps);
    });
  }

  async search(query: string): Promise<void> {
    this.queryState.set(query);

    await this.runRequest(async () => {
      const apps = await firstValueFrom(this.api.searchApps(query));
      this.appsState.set(apps);
    });
  }

  private async runRequest(action: () => Promise<void>): Promise<void> {
    this.loadingState.set(true);

    try {
      await action();
    } catch (error) {
      this.handleError(error);
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
