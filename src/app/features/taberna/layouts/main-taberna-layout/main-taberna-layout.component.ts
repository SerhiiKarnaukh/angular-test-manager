import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { TabernaFooterComponent } from '@features/taberna/components/taberna-footer/taberna-footer.component';
import { TabernaNavbarComponent } from '@features/taberna/components/taberna-navbar/taberna-navbar.component';

@Component({
  selector: 'app-main-taberna-layout',
  imports: [TabernaNavbarComponent, TabernaFooterComponent, RouterOutlet],
  template: `
    <div class="taberna-layout">
      <app-taberna-navbar />
      <main class="taberna-main">
        <router-outlet />
      </main>
      <app-taberna-footer />
    </div>
  `,
  styles: `
    .taberna-layout {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    .taberna-main {
      flex: 1;
    }
  `,
})
export class MainTabernaLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.checkActiveApp('taberna');
  }
}
