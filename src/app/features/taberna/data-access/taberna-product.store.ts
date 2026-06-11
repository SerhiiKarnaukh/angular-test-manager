import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { flattenApiErrors } from '@shared/utils/error.utils';

import { TabernaProductApiService } from './taberna-product.api.service';
import {
  EMPTY_TABERNA_PRODUCT_DETAIL,
  TabernaCategoryNavItem,
  TabernaCategoryWithProducts,
  TabernaProduct,
  TabernaProductDetailResponse,
} from './taberna-product.models';

@Injectable({ providedIn: 'root' })
export class TabernaProductStore {
  private readonly api = inject(TabernaProductApiService);
  private readonly alert = inject(AlertService);

  private readonly latestProductsState = signal<TabernaProduct[]>([]);
  private readonly productDetailState = signal<TabernaProductDetailResponse>(
    EMPTY_TABERNA_PRODUCT_DETAIL,
  );
  private readonly categoryState = signal<TabernaCategoryWithProducts | null>(null);
  private readonly searchResultsState = signal<TabernaProduct[]>([]);
  private readonly categoriesState = signal<TabernaCategoryNavItem[]>([]);
  private readonly queryState = signal('');
  private readonly loadingState = signal(false);

  readonly latestProducts = this.latestProductsState.asReadonly();
  readonly productDetail = this.productDetailState.asReadonly();
  readonly category = this.categoryState.asReadonly();
  readonly searchResults = this.searchResultsState.asReadonly();
  readonly categories = this.categoriesState.asReadonly();
  readonly query = this.queryState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();

  async loadLatestProducts(): Promise<void> {
    await this.runRequest(async () => {
      const products = await firstValueFrom(this.api.fetchLatestProducts());
      this.latestProductsState.set(products);
    });
  }

  async loadCategories(): Promise<void> {
    await this.runRequest(async () => {
      const categories = await firstValueFrom(this.api.fetchProductCategories());
      this.categoriesState.set(categories);
    }, { silent: true });
  }

  async loadCategory(categorySlug: string): Promise<void> {
    await this.runRequest(async () => {
      const category = await firstValueFrom(this.api.fetchCategoryProducts(categorySlug));
      this.categoryState.set(category);
    });
  }

  async loadProductDetail(categorySlug: string, productSlug: string): Promise<void> {
    await this.runRequest(async () => {
      const detail = await firstValueFrom(this.api.fetchProductDetail(categorySlug, productSlug));
      this.productDetailState.set(detail);
    });
  }

  clearProductDetail(): void {
    this.productDetailState.set(EMPTY_TABERNA_PRODUCT_DETAIL);
  }

  async search(query: string): Promise<void> {
    this.queryState.set(query);

    await this.runRequest(async () => {
      const products = await firstValueFrom(this.api.searchProducts(query));
      this.searchResultsState.set(products);
    });
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
