import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ChangePasswordResponse,
  EditProfileResponse,
  FriendRequestResponse,
  FriendsDataResponse,
  SocialFriendSuggestion,
  SocialUser,
} from './social-profile.models';

const BASE_URL = '/api/social-profiles';
const FRIENDS_BASE_URL = '/api/social-profiles/friends';

@Injectable({ providedIn: 'root' })
export class SocialProfileApiService {
  private readonly http = inject(HttpClient);

  fetchMe(): Observable<SocialUser> {
    return this.http.get<SocialUser>(`${BASE_URL}/me/`);
  }

  updateProfile(formData: FormData): Observable<EditProfileResponse> {
    return this.http.post<EditProfileResponse>(`${BASE_URL}/editprofile/`, formData);
  }

  changePassword(payload: Record<string, string>): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(`${BASE_URL}/editpassword/`, payload);
  }

  sendFriendRequest(userSlug: string): Observable<FriendRequestResponse> {
    return this.http.post<FriendRequestResponse>(`${FRIENDS_BASE_URL}/${userSlug}/request/`, {});
  }

  fetchFriendsData(userSlug: string): Observable<FriendsDataResponse> {
    return this.http.get<FriendsDataResponse>(`${FRIENDS_BASE_URL}/${userSlug}/`);
  }

  handleFriendRequest(slug: string, status: string): Observable<unknown> {
    return this.http.post(`${FRIENDS_BASE_URL}/${slug}/${status}/`, {});
  }

  fetchFriendSuggestions(): Observable<SocialFriendSuggestion[]> {
    return this.http.get<SocialFriendSuggestion[]>(`${FRIENDS_BASE_URL}/suggested/`);
  }
}
