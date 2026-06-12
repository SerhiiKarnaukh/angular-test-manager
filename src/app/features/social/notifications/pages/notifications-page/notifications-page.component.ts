import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { PeopleYouMayKnowComponent } from '@features/social/profiles/components/people-you-may-know/people-you-may-know.component';
import { SocialPageLayoutComponent } from '@features/social/posts/components/social-page-layout/social-page-layout.component';
import { TrendsComponent } from '@features/social/posts/components/trends/trends.component';
import { SocialNotificationsStore } from '@features/social/notifications/data-access/social-notifications.store';
import { SocialNotification } from '@features/social/notifications/data-access/social-notification.models';

@Component({
  selector: 'app-notifications-page',
  imports: [SocialPageLayoutComponent, MatCardModule, MatButtonModule, PeopleYouMayKnowComponent, TrendsComponent],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss',
})
export class NotificationsPageComponent implements OnInit {
  private readonly notificationsStore = inject(SocialNotificationsStore);
  private readonly title = inject(Title);

  protected readonly notifications = this.notificationsStore.notifications;

  ngOnInit(): void {
    this.title.setTitle('Notifications | Social Network');
    void this.notificationsStore.loadNotifications();
  }

  protected readNotification(notification: SocialNotification): void {
    void this.notificationsStore.readNotification(notification);
  }
}
