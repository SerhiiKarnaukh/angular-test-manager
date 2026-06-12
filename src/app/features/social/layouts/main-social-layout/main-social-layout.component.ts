import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { SocialNavbarComponent } from '@features/social/components/social-navbar/social-navbar.component';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';

@Component({
  selector: 'app-main-social-layout',
  imports: [SocialNavbarComponent, RouterOutlet],
  template: `
    <div class="social-layout">
      <app-social-navbar />
      <main class="social-main">
        <router-outlet />
      </main>
      <footer class="social-footer">Applications Manager — Angular</footer>
    </div>
  `,
  styles: `
    .social-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .social-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .social-footer {
      padding: 16px 24px;
      text-align: center;
      opacity: 0.7;
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
