import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { VueApp, VueAppsSearchResponse } from './vue-app.models';
import { normalizeVueAppsSearchResponse } from './vue-apps-response.utils';

const BASE_URL = '/api/v1/vue-apps';

@Injectable({ providedIn: 'root' })
export class VueAppsApiService {
  private readonly http = inject(HttpClient);

  fetchApps(): Observable<VueApp[]> {
    return this.http.get<VueApp[]>(`${BASE_URL}/`);
  }

  searchApps(query: string): Observable<VueApp[]> {
    return this.http
      .post<VueAppsSearchResponse>(`${BASE_URL}/search/`, { query })
      .pipe(map(normalizeVueAppsSearchResponse));
  }
}
