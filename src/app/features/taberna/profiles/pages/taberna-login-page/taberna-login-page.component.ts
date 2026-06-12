import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { TabernaCartStore } from '@features/taberna/cart/data-access/taberna-cart.store';
import { AlertService } from '@core/alert/alert.service';
import {
  AuthLoginFormComponent,
  AuthLoginFormValue,
} from '@shared/ui/auth-login-form/auth-login-form.component';
import { AuthPageShellComponent } from '@shared/ui/auth-page-shell/auth-page-shell.component';

@Component({
  selector: 'app-taberna-login-page',
  imports: [AuthPageShellComponent, AuthLoginFormComponent],
  template: `
    <app-auth-page-shell>
      <app-auth-login-form
        namePrefix="taberna"
        signupPath="/taberna/signup"
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
export class TabernaLoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly cartStore = inject(TabernaCartStore);
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
      cart_id: this.cartStore.cartId() ?? undefined,
    });

    await this.cartStore.loadCart();
    this.cartStore.clearCartId();

    const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/taberna/dashboard';
    await this.router.navigateByUrl(redirect);
  }
}
