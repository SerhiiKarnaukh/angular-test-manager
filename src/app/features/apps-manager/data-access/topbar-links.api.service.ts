import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TOPBAR_LINK_LABELS, TopbarLink } from './topbar-link.models';

const BASE_URL = '/api/v1/topbar-links';

@Injectable({ providedIn: 'root' })
export class TopbarLinksApiService {
  private readonly http = inject(HttpClient);

  fetchLinks(): Observable<TopbarLink[]> {
    return this.http
      .get<TopbarLink[]>(`${BASE_URL}/`)
      .pipe(map((links) => links.map((link) => ({ ...link, title: TOPBAR_LINK_LABELS[link.key] }))));
  }
}
