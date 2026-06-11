import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  TabernaCategoryNavItem,
  TabernaCategoryWithProducts,
  TabernaProduct,
  TabernaProductDetailResponse,
} from './taberna-product.models';

const BASE_URL = '/taberna-store/api/v1';

@Injectable({ providedIn: 'root' })
export class TabernaProductApiService {
  private readonly http = inject(HttpClient);

  fetchLatestProducts(): Observable<TabernaProduct[]> {
    return this.http.get<TabernaProduct[]>(`${BASE_URL}/latest-products/`);
  }

  fetchCategoryProducts(categorySlug: string): Observable<TabernaCategoryWithProducts> {
    return this.http.get<TabernaCategoryWithProducts>(`${BASE_URL}/products/${categorySlug}/`);
  }

  fetchProductDetail(
    categorySlug: string,
    productSlug: string,
  ): Observable<TabernaProductDetailResponse> {
    return this.http.get<TabernaProductDetailResponse>(
      `${BASE_URL}/products/${categorySlug}/${productSlug}`,
    );
  }

  fetchProductCategories(): Observable<TabernaCategoryNavItem[]> {
    return this.http.get<TabernaCategoryNavItem[]>(`${BASE_URL}/product-categories/`);
  }

  searchProducts(query: string): Observable<TabernaProduct[]> {
    return this.http.post<TabernaProduct[]>(`${BASE_URL}/products/search/`, { query });
  }
}
