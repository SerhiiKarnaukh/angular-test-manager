import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@core/alert/alert.service';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';
import {
  AuthLoginFormComponent,
  AuthLoginFormValue,
} from '@shared/ui/auth-login-form/auth-login-form.component';
import { AuthPageShellComponent } from '@shared/ui/auth-page-shell/auth-page-shell.component';

@Component({
  selector: 'app-social-login-page',
  imports: [AuthPageShellComponent, AuthLoginFormComponent],
  template: `
    <app-auth-page-shell>
      <app-auth-login-form
        namePrefix="social"
        signupPath="/social/signup"
        (submitted)="onLogin($event)"
      />
    </app-auth-page-shell>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
      width: 100%;
    }
  `,
})
export class SocialLoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly profileStore = inject(SocialProfileStore);
  private readonly alert = inject(AlertService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    if (this.route.snapshot.queryParamMap.has('message')) {
      this.alert.setMessage({
        value: ['Please login'],
        type: 'warning',
      });
    }
  }

  async onLogin(credentials: AuthLoginFormValue): Promise<void> {
    await this.auth.login({
      ...credentials,
      login_source: 'social',
      activeApp: 'social',
    });
    await this.profileStore.loadUserData();
    await this.router.navigateByUrl('/social/home');
  }
}
