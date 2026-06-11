import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LayoutShellComponent } from '@shared/ui/layout-shell/layout-shell.component';

@Component({
  selector: 'app-main-apps-manager-layout',
  imports: [LayoutShellComponent, RouterOutlet],
  template: `
    <app-layout-shell appName="Apps Manager">
      <router-outlet />
    </app-layout-shell>
  `,
})
export class MainAppsManagerLayoutComponent {}
