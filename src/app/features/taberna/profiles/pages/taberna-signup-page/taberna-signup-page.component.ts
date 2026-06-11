import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import {
  AuthSignupFormComponent,
  AuthSignupFormValue,
} from '@shared/ui/auth-signup-form/auth-signup-form.component';

@Component({
  selector: 'app-taberna-signup-page',
  imports: [AuthSignupFormComponent],
  template: `
    <app-auth-signup-form
      namePrefix="taberna"
      loginPath="/taberna/login"
      (submitted)="onSignup($event)"
    />
  `,
})
export class TabernaSignupPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async onSignup(payload: AuthSignupFormValue): Promise<void> {
    await this.auth.register({
      ...payload,
      registration_source: 'taberna',
    });
    await this.router.navigateByUrl('/taberna/login');
  }
}
