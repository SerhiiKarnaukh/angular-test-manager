import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { JwtTokenPair, RegisterPayload } from './auth.models';
import { JWT_REFRESH_URL } from './auth-jwt-api.service';

const REGISTER_BY_SOURCE: Record<string, string> = {
  social_network: '/api/social-profiles/register/',
  taberna: '/taberna-profiles/api/register/',
};

export const DEFAULT_REGISTER_URL = '/api/v1/authusers/';
export const TOKEN_LOGIN_URL = '/auth/token/login/';
export const TOKEN_LOGOUT_URL = '/auth/token/logout/';

@Injectable({ providedIn: 'root' })
export class AuthTokenApiService {
  private readonly http = inject(HttpClient);

  resolveRegisterUrl(registrationSource: string): string {
    return REGISTER_BY_SOURCE[registrationSource] ?? DEFAULT_REGISTER_URL;
  }

  loginWithToken(payload: Record<string, unknown>): Observable<{ auth_token: string }> {
    return this.http.post<{ auth_token: string }>(TOKEN_LOGIN_URL, payload);
  }

  logoutWithToken(token: string): Observable<unknown> {
    return this.http.post(TOKEN_LOGOUT_URL, null, {
      headers: { Authorization: `Token ${token}` },
    });
  }

  registerUser(url: string, payload: RegisterPayload): Observable<{ detail?: string }> {
    return this.http.post<{ detail?: string }>(url, payload);
  }

  refreshJwtToken(refresh: string): Observable<JwtTokenPair> {
    return this.http.post<JwtTokenPair>(JWT_REFRESH_URL, { refresh });
  }
}
