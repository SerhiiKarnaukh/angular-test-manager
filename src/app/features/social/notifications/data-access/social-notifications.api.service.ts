import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SocialNotification } from './social-notification.models';

const BASE_URL = '/api/social-notifications';

@Injectable({ providedIn: 'root' })
export class SocialNotificationsApiService {
  private readonly http = inject(HttpClient);

  fetchNotifications(): Observable<SocialNotification[]> {
    return this.http.get<SocialNotification[]>(`${BASE_URL}/`);
  }

  markNotificationRead(notificationId: number): Observable<unknown> {
    return this.http.post(`${BASE_URL}/read/${notificationId}/`, {});
  }
}
