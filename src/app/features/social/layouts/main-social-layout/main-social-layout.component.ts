import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { SocialFooterComponent } from '@features/social/components/social-footer/social-footer.component';
import { SocialNavbarComponent } from '@features/social/components/social-navbar/social-navbar.component';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';

@Component({
  selector: 'app-main-social-layout',
  imports: [SocialNavbarComponent, SocialFooterComponent, RouterOutlet],
  template: `
    <div class="social-layout">
      <header class="social-header">
        <app-social-navbar />
      </header>
      <main class="social-main">
        <router-outlet />
      </main>
      <app-social-footer />
    </div>
  `,
  styles: `
    .social-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .social-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      height: var(--social-nav-height);
    }

    .social-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-top: var(--social-nav-height);
      background-color: var(--social-page-bg);
    }
  `,
})
export class MainSocialLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly profileStore = inject(SocialProfileStore);

  ngOnInit(): void {
    this.auth.checkActiveApp('social');
    this.profileStore.initFromStorage();

    if (this.auth.isAuthenticated()) {
      void this.profileStore.loadUserData();
    }
  }
}
