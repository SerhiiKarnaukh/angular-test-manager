import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';

import { SocialNotificationWebSocketService } from './social-notification-websocket.service';
import { SocialNotificationsApiService } from './social-notifications.api.service';
import { SocialNotification } from './social-notification.models';

@Injectable({ providedIn: 'root' })
export class SocialNotificationsStore {
  private readonly api = inject(SocialNotificationsApiService);
  private readonly auth = inject(AuthService);
  private readonly profileStore = inject(SocialProfileStore);
  private readonly notificationWebSocket = inject(SocialNotificationWebSocketService);
  private readonly router = inject(Router);

  private readonly notificationsState = signal<SocialNotification[]>([]);

  readonly notifications = this.notificationsState.asReadonly();
  readonly unreadCount = computed(() => this.notificationsState().length);

  async loadNotifications(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.notificationsState.set([]);
      return;
    }

    try {
      const notifications = await firstValueFrom(this.api.fetchNotifications());
      this.notificationsState.set(notifications);
    } catch (error) {
      console.error(error);
    }
  }

  connectNotificationWebSocket(): void {
    const userId = this.profileStore.user()?.id;
    if (!this.auth.isAuthenticated() || !userId) {
      return;
    }

    this.notificationWebSocket.connect(userId, () => {
      void this.loadNotifications();
    });
  }

  disconnectNotificationWebSocket(): void {
    this.notificationWebSocket.disconnect();
  }

  clearNotificationData(): void {
    this.notificationsState.set([]);
    this.disconnectNotificationWebSocket();
  }

  async readNotification(notification: SocialNotification): Promise<void> {
    try {
      await firstValueFrom(this.api.markNotificationRead(notification.id));
      this.notificationsState.update((items) => items.filter((item) => item.id !== notification.id));
      await this.navigateAfterRead(notification);
    } catch (error) {
      console.error(error);
    }
  }

  private async navigateAfterRead(notification: SocialNotification): Promise<void> {
    const userSlug = this.profileStore.user()?.slug;

    if (
      notification.type_of_notification === 'post_like' ||
      notification.type_of_notification === 'post_comment'
    ) {
      await this.router.navigate(['/social', notification.post_id]);
      return;
    }

    if (notification.type_of_notification === 'chat_message') {
      await this.router.navigateByUrl('/social/chat');
      return;
    }

    if (userSlug) {
      await this.router.navigate(['/social/profile', userSlug, 'friends']);
    }
  }
}
