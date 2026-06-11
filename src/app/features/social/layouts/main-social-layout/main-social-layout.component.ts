import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { LayoutShellComponent } from '@shared/ui/layout-shell/layout-shell.component';

@Component({
  selector: 'app-main-social-layout',
  imports: [LayoutShellComponent, RouterOutlet],
  template: `
    <app-layout-shell appName="Social Network">
      <router-outlet />
    </app-layout-shell>
  `,
})
export class MainSocialLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.checkActiveApp('social');
  }
}
