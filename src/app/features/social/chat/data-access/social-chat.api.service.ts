import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = '/api/social-chat';

@Injectable({ providedIn: 'root' })
export class SocialChatApiService {
  private readonly http = inject(HttpClient);

  getOrCreateChat(userSlug: string): Observable<unknown> {
    return this.http.get(`${BASE_URL}/${userSlug}/get-or-create/`);
  }
}
