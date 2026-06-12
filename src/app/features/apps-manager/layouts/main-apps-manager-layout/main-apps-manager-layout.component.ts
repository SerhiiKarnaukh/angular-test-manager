import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppsManagerFooterComponent } from '../../components/apps-manager-footer/apps-manager-footer.component';
import { AppsManagerNavbarComponent } from '../../components/apps-manager-navbar/apps-manager-navbar.component';

@Component({
  selector: 'app-main-apps-manager-layout',
  imports: [AppsManagerNavbarComponent, AppsManagerFooterComponent, RouterOutlet],
  template: `
    <div class="apps-manager-layout">
      <app-apps-manager-navbar />
      <main class="apps-manager-main">
        <router-outlet />
      </main>
      <app-apps-manager-footer />
    </div>
  `,
  styles: `
    .apps-manager-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .apps-manager-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `,
})
export class MainAppsManagerLayoutComponent {}
