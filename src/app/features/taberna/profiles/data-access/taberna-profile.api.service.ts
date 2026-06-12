import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TabernaUserOrder } from './taberna-profile.models';

const BASE_URL = '/taberna-profiles/api/v1';

@Injectable({ providedIn: 'root' })
export class TabernaProfileApiService {
  private readonly http = inject(HttpClient);

  fetchUserOrders(): Observable<TabernaUserOrder[]> {
    return this.http.get<TabernaUserOrder[]>(`${BASE_URL}/orders/`);
  }
}
