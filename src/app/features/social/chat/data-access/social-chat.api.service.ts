import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SocialActiveConversation,
  SocialConversationListItem,
} from './social-chat.models';

const BASE_URL = '/api/social-chat';

@Injectable({ providedIn: 'root' })
export class SocialChatApiService {
  private readonly http = inject(HttpClient);

  fetchConversations(): Observable<SocialConversationListItem[]> {
    return this.http.get<SocialConversationListItem[]>(`${BASE_URL}/`);
  }

  fetchChatMessages(conversationId: number): Observable<SocialActiveConversation> {
    return this.http.get<SocialActiveConversation>(`${BASE_URL}/${conversationId}/`);
  }

  getOrCreateChat(userSlug: string): Observable<unknown> {
    return this.http.get(`${BASE_URL}/${userSlug}/get-or-create/`);
  }

  sendChatMessage(conversationId: number, body: string): Observable<unknown> {
    return this.http.post(`${BASE_URL}/${conversationId}/send/`, { body });
  }
}
