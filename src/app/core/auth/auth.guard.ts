import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { getLoginRoute } from './get-login-route';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (route.data['authJWT'] !== true || auth.isAuthenticated()) {
    return true;
  }

  return router.parseUrl(getLoginRoute(state.url));
};
