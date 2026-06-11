import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { flattenApiErrors } from '@shared/utils/error.utils';

import { AuthJwtApiService } from './auth-jwt-api.service';
import { AuthTokenApiService } from './auth-token-api.service';
import { JwtLoginCredentials, JwtTokenPair, RegisterPayload } from './auth.models';

const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';
const ACTIVE_APP_KEY = 'active_app';
const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly jwtApi = inject(AuthJwtApiService);
  private readonly tokenApi = inject(AuthTokenApiService);
  private readonly alert = inject(AlertService);

  private readonly accessTokenState = signal(localStorage.getItem(ACCESS_KEY));
  private readonly refreshTokenState = signal(localStorage.getItem(REFRESH_KEY));
  private readonly activeAppState = signal(localStorage.getItem(ACTIVE_APP_KEY));
  private readonly registrationTokenState = signal(localStorage.getItem(TOKEN_KEY));

  readonly isAuthenticated = computed(() => !!this.accessTokenState());
  readonly accessToken = this.accessTokenState.asReadonly();
  readonly refreshToken = this.refreshTokenState.asReadonly();
  readonly activeApp = this.activeAppState.asReadonly();
  readonly registrationToken = this.registrationTokenState.asReadonly();

  async login(credentials: JwtLoginCredentials): Promise<JwtTokenPair> {
    const url = this.jwtApi.resolveLoginUrl(credentials);

    try {
      const response = await firstValueFrom(
        this.http.post<JwtTokenPair>(url, { ...credentials }),
      );
      this.storeTokens(response.access, response.refresh);
      this.setActiveApp(credentials.activeApp ?? null);
      this.alert.clearMessage();
      return response;
    } catch (error) {
      this.handleAuthError(error);
      this.clearTokens();
      throw error;
    }
  }

  logout(): void {
    localStorage.clear();
    this.accessTokenState.set(null);
    this.refreshTokenState.set(null);
    this.activeAppState.set(null);
    this.registrationTokenState.set(null);
  }

  async refreshSession(): Promise<boolean> {
    const refresh = this.refreshTokenState();
    if (!refresh) {
      this.logout();
      return false;
    }

    try {
      const response = await firstValueFrom(this.tokenApi.refreshJwtToken(refresh));
      this.storeAccessToken(response.access);
      return true;
    } catch {
      this.clearTokens();
      this.logout();
      return false;
    }
  }

  checkActiveApp(activeApp: string): void {
    const current = this.activeAppState();
    if (activeApp && current && current !== activeApp) {
      this.logout();
    }
  }

  async register(payload: RegisterPayload): Promise<void> {
    const url = this.tokenApi.resolveRegisterUrl(payload.registration_source);

    try {
      const response = await firstValueFrom(this.tokenApi.registerUser(url, payload));
      this.alert.setMessage({
        value: [this.buildRegisterSuccessMessage(payload.email, response.detail)],
        type: 'success',
      });
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  private storeTokens(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    this.accessTokenState.set(access);
    this.refreshTokenState.set(refresh);
  }

  private storeAccessToken(access: string): void {
    localStorage.setItem(ACCESS_KEY, access);
    this.accessTokenState.set(access);
  }

  private setActiveApp(app: string | null): void {
    if (app) {
      localStorage.setItem(ACTIVE_APP_KEY, app);
    } else {
      localStorage.removeItem(ACTIVE_APP_KEY);
    }
    this.activeAppState.set(app);
  }

  private clearTokens(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    this.accessTokenState.set(null);
    this.refreshTokenState.set(null);
  }

  private buildRegisterSuccessMessage(email: string, detail?: string): string {
    if (detail === 'social_profile_created') {
      return 'Yor Social Profile created';
    }

    return `Thank you for registering with us. We have sent you a verification email to your email address [${email}]`;
  }

  private handleAuthError(error: unknown): void {
    const body = (error as { error?: Record<string, unknown> })?.error;
    if (body && typeof body === 'object') {
      this.alert.setMessage({ value: flattenApiErrors(body), type: 'error' });
    }
  }
}
