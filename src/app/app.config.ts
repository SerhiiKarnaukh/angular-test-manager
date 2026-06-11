import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { apiBaseUrlInterceptor } from '@core/http/api-base-url.interceptor';
import { jwtInterceptor } from '@core/http/jwt.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([apiBaseUrlInterceptor, jwtInterceptor])),
    provideRouter(routes),
  ],
};
