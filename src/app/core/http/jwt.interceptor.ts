import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { AuthJwtApiService } from '@core/auth/auth-jwt-api.service';
import { AuthService } from '@core/auth/auth.service';

export const JWT_RETRY = new HttpContextToken<boolean>(() => false);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const jwtApi = inject(AuthJwtApiService);

  const token = auth.accessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status !== 401 ||
        req.context.get(JWT_RETRY) ||
        jwtApi.isObtainOrRefreshUrl(req.url)
      ) {
        return throwError(() => error);
      }

      const retryReq = authReq.clone({
        context: req.context.set(JWT_RETRY, true),
      });

      return from(auth.refreshSession()).pipe(
        switchMap((refreshed) => {
          if (!refreshed) {
            return throwError(() => error);
          }

          const newToken = auth.accessToken();
          const retried = newToken
            ? retryReq.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })
            : retryReq;

          return next(retried);
        }),
      );
    }),
  );
};
