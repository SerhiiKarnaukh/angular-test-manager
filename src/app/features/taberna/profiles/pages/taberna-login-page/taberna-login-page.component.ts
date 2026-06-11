import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@core/alert/alert.service';
import {
  AuthLoginFormComponent,
  AuthLoginFormValue,
} from '@shared/ui/auth-login-form/auth-login-form.component';

@Component({
  selector: 'app-taberna-login-page',
  imports: [AuthLoginFormComponent],
  template: `
    <app-auth-login-form
      namePrefix="taberna"
      signupPath="/taberna/signup"
      (submitted)="onLogin($event)"
    />
  `,
})
export class TabernaLoginPageComponent {
  private readonly auth = inject(AuthService);
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
      login_source: 'taberna',
      activeApp: 'taberna',
      cart_id: localStorage.getItem('cartId') ?? undefined,
    });

    const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/taberna/dashboard';
    await this.router.navigateByUrl(redirect);
  }
}
