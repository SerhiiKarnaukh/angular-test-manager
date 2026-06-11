import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppsManagerFooterComponent } from '../../components/apps-manager-footer/apps-manager-footer.component';
import { AppsManagerNavbarComponent } from '../../components/apps-manager-navbar/apps-manager-navbar.component';

@Component({
  selector: 'app-main-apps-manager-layout',
  imports: [AppsManagerNavbarComponent, AppsManagerFooterComponent, RouterOutlet],
  template: `
    <app-apps-manager-navbar />
    <router-outlet />
    <app-apps-manager-footer />
  `,
})
export class MainAppsManagerLayoutComponent {}
