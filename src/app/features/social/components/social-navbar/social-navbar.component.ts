import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { environment } from '@env/environment';
import { SOCIAL_DEFAULT_AVATAR } from '@features/social/posts/data-access/social-post.models';
import { SocialChatStore } from '@features/social/chat/data-access/social-chat.store';
import { SocialNotificationsStore } from '@features/social/notifications/data-access/social-notifications.store';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';
import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-social-navbar',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './social-navbar.component.html',
  styleUrl: './social-navbar.component.scss',
})
export class SocialNavbarComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly chatStore = inject(SocialChatStore);

  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly profileStore = inject(SocialProfileStore);
  protected readonly notificationsStore = inject(SocialNotificationsStore);

  protected readonly remoteHost = environment.remoteHost;
  protected readonly defaultAvatar = SOCIAL_DEFAULT_AVATAR;
  protected readonly user = this.profileStore.user;
  protected readonly unreadCount = this.notificationsStore.unreadCount;

  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  constructor() {
    effect(() => {
      const userId = this.profileStore.user()?.id;
      if (this.auth.isAuthenticated() && userId) {
        void this.notificationsStore.loadNotifications();
        this.notificationsStore.connectNotificationWebSocket();
      } else {
        this.notificationsStore.clearNotificationData();
      }
    });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      void this.notificationsStore.loadNotifications();
    }
  }

  protected async logout(): Promise<void> {
    this.notificationsStore.clearNotificationData();
    this.chatStore.clearChatData();
    this.profileStore.clearUserState();
    this.auth.logout();
    await this.router.navigateByUrl('/social/login');
  }
}
