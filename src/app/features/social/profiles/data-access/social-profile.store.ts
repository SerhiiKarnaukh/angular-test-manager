import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';
import { flattenApiErrors } from '@shared/utils/error.utils';

import { SocialProfileApiService } from './social-profile.api.service';
import {
  FriendsDataResponse,
  SocialFriendSuggestion,
  SocialUser,
  SocialViewedProfile,
} from './social-profile.models';
import {
  clearSocialUserStorage,
  persistSocialUser,
  restoreSocialUser,
} from './social-profile.persistence';

@Injectable({ providedIn: 'root' })
export class SocialProfileStore {
  private readonly api = inject(SocialProfileApiService);
  private readonly auth = inject(AuthService);
  private readonly alert = inject(AlertService);
  private readonly router = inject(Router);

  private readonly userState = signal<SocialUser | null>(null);
  private readonly currentProfileState = signal<SocialViewedProfile | null>(null);
  private readonly friendshipRequestsState = signal<FriendsDataResponse['requests']>([]);
  private readonly currentProfileFriendsState = signal<FriendsDataResponse['friends']>([]);
  private readonly friendSuggestionsState = signal<SocialFriendSuggestion[]>([]);
  private readonly loadingState = signal(false);

  readonly user = this.userState.asReadonly();
  readonly currentProfile = this.currentProfileState.asReadonly();
  readonly friendshipRequests = this.friendshipRequestsState.asReadonly();
  readonly currentProfileFriends = this.currentProfileFriendsState.asReadonly();
  readonly friendSuggestions = this.friendSuggestionsState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly hasUser = computed(() => !!this.userState()?.id);

  initFromStorage(): void {
    if (!this.auth.isAuthenticated()) {
      this.clearUserState();
      return;
    }

    const restored = restoreSocialUser();
    if (restored) {
      this.userState.set(restored);
    }
  }

  async loadUserData(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.clearUserState();
      return;
    }

    this.loadingState.set(true);

    try {
      const user = await firstValueFrom(this.api.fetchMe());
      this.setUserInfo(user);
    } catch (error) {
      await this.handleMissingUser(error);
    } finally {
      this.loadingState.set(false);
    }
  }

  setUserInfo(user: SocialUser): void {
    this.userState.set(user);
    persistSocialUser(user);
  }

  clearUserState(): void {
    this.userState.set(null);
    this.currentProfileState.set(null);
    this.friendshipRequestsState.set([]);
    this.currentProfileFriendsState.set([]);
    this.friendSuggestionsState.set([]);
    clearSocialUserStorage();
  }

  async sendFriendshipRequest(userSlug: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.api.sendFriendRequest(userSlug));

      if (response.message === 'request already sent') {
        this.alert.setMessage({
          value: ['The request has already been sent!'],
          type: 'error',
        });
        return false;
      }

      this.alert.setMessage({ value: ['The request was sent!'], type: 'success' });
      return true;
    } catch {
      this.alert.setMessage({ value: ['You must be logged in!'], type: 'error' });
      return false;
    }
  }

  async loadFriendsData(userSlug: string): Promise<void> {
    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.fetchFriendsData(userSlug));
      this.setFriendsData(response);
    });
  }

  async handleFriendshipRequest(status: string, slug: string): Promise<void> {
    const currentSlug = this.userState()?.slug;
    if (!currentSlug) {
      return;
    }

    try {
      await firstValueFrom(this.api.handleFriendRequest(slug, status));
      await this.loadFriendsData(currentSlug);
    } catch (error) {
      this.handleError(error);
    }
  }

  async loadFriendSuggestions(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.friendSuggestionsState.set([]);
      return;
    }

    try {
      const suggestions = await firstValueFrom(this.api.fetchFriendSuggestions());
      this.friendSuggestionsState.set(suggestions);
    } catch (error) {
      console.error(error);
    }
  }

  async editProfile(formData: FormData): Promise<string | null> {
    const currentUser = this.userState();
    if (!currentUser) {
      return null;
    }

    try {
      const response = await firstValueFrom(this.api.updateProfile(formData));

      if (response.message !== 'Information updated successfully') {
        this.alert.setMessage({ value: [response.message], type: 'error' });
        return null;
      }

      this.alert.setMessage({ value: [response.message], type: 'success' });

      const updatedUser: SocialUser = {
        id: currentUser.id,
        username: String(formData.get('username') ?? currentUser.username),
        first_name: String(formData.get('first_name') ?? currentUser.first_name),
        last_name: String(formData.get('last_name') ?? currentUser.last_name),
        email: String(formData.get('email') ?? currentUser.email),
        slug: response.new_slug,
        full_name: `${String(formData.get('first_name'))} ${String(formData.get('last_name'))}`,
        avatar_url: response.new_avatar ?? currentUser.avatar_url,
      };

      this.setUserInfo(updatedUser);
      await this.router.navigate(['/social/profile', response.new_slug]);
      return response.new_slug;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async editPassword(payload: Record<string, string>): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.api.changePassword(payload));

      if (response.message === 'success') {
        this.alert.setMessage({ value: ['The information was saved'], type: 'success' });

        const slug = this.userState()?.slug;
        if (slug) {
          await this.router.navigate(['/social/profile', slug]);
        }

        return true;
      }

      this.showPasswordErrors(response.message);
      return false;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  private setFriendsData(data: FriendsDataResponse): void {
    this.friendshipRequestsState.set(data.requests);
    this.currentProfileFriendsState.set(data.friends);
    this.currentProfileState.set(data.user);
  }

  private async handleMissingUser(error: unknown): Promise<void> {
    const status = (error as { status?: number })?.status;
    const message = (error as { error?: { message?: string } })?.error?.message;

    if (status === 404) {
      this.auth.logout();
      this.clearUserState();
      this.alert.setMessage({ value: [message ?? 'User not found'], type: 'error' });
      await this.router.navigateByUrl('/social/login');
    } else {
      console.error(error);
    }
  }

  private showPasswordErrors(message: string): void {
    try {
      const data = JSON.parse(message) as Record<string, { message: string }[]>;
      const errorMessages = Object.values(data).map((items) => items[0]?.message).filter(Boolean);
      this.alert.setMessage({ value: errorMessages, type: 'error' });
    } catch {
      this.alert.setMessage({ value: [message], type: 'error' });
    }
  }

  private async runRequest(action: () => Promise<void>): Promise<void> {
    this.loadingState.set(true);

    try {
      await action();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.loadingState.set(false);
    }
  }

  private handleError(error: unknown): void {
    const body = (error as { error?: Record<string, unknown> })?.error;
    if (body && typeof body === 'object') {
      this.alert.setMessage({ value: flattenApiErrors(body), type: 'error' });
      return;
    }

    console.error(error);
  }
}
