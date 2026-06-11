import { Injectable } from '@angular/core';

import { JwtLoginCredentials } from './auth.models';

const LOGIN_BY_SOURCE: Record<string, string> = {
  taberna: '/taberna-profiles/api/v1/token/',
  social: '/api/social-profiles/api/v1/token/',
};

export const DEFAULT_JWT_LOGIN_URL = '/api/v1/token/';
export const JWT_REFRESH_URL = '/api/v1/token/refresh/';

@Injectable({ providedIn: 'root' })
export class AuthJwtApiService {
  resolveLoginUrl(credentials: JwtLoginCredentials): string {
    const key = credentials.login_source;
    if (key && LOGIN_BY_SOURCE[key]) {
      return LOGIN_BY_SOURCE[key];
    }
    return DEFAULT_JWT_LOGIN_URL;
  }

  isObtainOrRefreshUrl(url: string): boolean {
    if (!url) {
      return false;
    }
    const path = url.replace(/^https?:\/\/[^/?#]+/, '');
    if (path.includes('/token/refresh')) {
      return true;
    }
    return /\/v1\/token\/?(\?|$)/.test(path);
  }
}
