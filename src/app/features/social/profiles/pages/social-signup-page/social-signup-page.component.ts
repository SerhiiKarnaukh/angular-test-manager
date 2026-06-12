import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import {
  AuthSignupFormComponent,
  AuthSignupFormValue,
} from '@shared/ui/auth-signup-form/auth-signup-form.component';
import { AuthPageShellComponent } from '@shared/ui/auth-page-shell/auth-page-shell.component';

@Component({
  selector: 'app-social-signup-page',
  imports: [AuthPageShellComponent, AuthSignupFormComponent],
  template: `
    <app-auth-page-shell>
      <app-auth-signup-form
        namePrefix="social"
        loginPath="/social/login"
        (submitted)="onSignup($event)"
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
export class SocialSignupPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async onSignup(payload: AuthSignupFormValue): Promise<void> {
    await this.auth.register({
      ...payload,
      registration_source: 'social_network',
    });
    await this.router.navigateByUrl('/social/login');
  }
}
