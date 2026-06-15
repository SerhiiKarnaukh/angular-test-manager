import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { reportApiError } from '@shared/utils/error.utils';

import { SocialChatApiService } from './social-chat.api.service';
import { SocialChatWebSocketService } from './social-chat-websocket.service';
import {
  EMPTY_ACTIVE_CONVERSATION,
  SocialActiveConversation,
  SocialChatMessage,
  SocialConversationListItem,
} from './social-chat.models';

@Injectable({ providedIn: 'root' })
export class SocialChatStore {
  private readonly api = inject(SocialChatApiService);
  private readonly chatWebSocket = inject(SocialChatWebSocketService);
  private readonly alert = inject(AlertService);

  private readonly conversationsState = signal<SocialConversationListItem[]>([]);
  private readonly activeConversationState = signal<SocialActiveConversation>(EMPTY_ACTIVE_CONVERSATION);
  private readonly loadingState = signal(false);

  readonly conversations = this.conversationsState.asReadonly();
  readonly activeConversation = this.activeConversationState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();

  async loadConversations(userId: number): Promise<void> {
    this.loadingState.set(true);

    try {
      const conversations = await firstValueFrom(this.api.fetchConversations());
      this.conversationsState.set(conversations);

      if (conversations.length) {
        await this.selectConversation(conversations[0].id, userId);
      } else {
        this.chatWebSocket.disconnect();
        this.activeConversationState.set(EMPTY_ACTIVE_CONVERSATION);
      }
    } catch (error) {
      reportApiError(this.alert, error);
    } finally {
      this.loadingState.set(false);
    }
  }

  async selectConversation(conversationId: number, userId: number): Promise<void> {
    this.chatWebSocket.disconnect();
    this.connectWebSocket(conversationId, userId);
    await this.loadMessages(conversationId);
  }

  async loadMessages(conversationId: number): Promise<void> {
    try {
      const conversation = await firstValueFrom(this.api.fetchChatMessages(conversationId));
      this.activeConversationState.set(conversation);
    } catch (error) {
      reportApiError(this.alert, error);
    }
  }

  async sendMessage(body: string): Promise<void> {
    const conversation = this.activeConversationState();
    if (!body.trim() || !conversation.id) {
      return;
    }

    try {
      await firstValueFrom(this.api.sendChatMessage(conversation.id, body));
    } catch (error) {
      reportApiError(this.alert, error);
      throw error;
    }
  }

  async getOrCreateChat(userSlug: string): Promise<void> {
    try {
      await firstValueFrom(this.api.getOrCreateChat(userSlug));
    } catch (error) {
      this.alert.setMessage({ value: ['You must be logged in!'], type: 'error' });
      throw error;
    }
  }

  disconnectWebSocket(): void {
    this.chatWebSocket.disconnect();
  }

  clearChatData(): void {
    this.disconnectWebSocket();
    this.conversationsState.set([]);
    this.activeConversationState.set(EMPTY_ACTIVE_CONVERSATION);
  }

  private connectWebSocket(conversationId: number, userId: number): void {
    this.chatWebSocket.connect(conversationId, userId, (message) => {
      this.appendMessage(message);
    });
  }

  private appendMessage(message: SocialChatMessage): void {
    this.activeConversationState.update((conversation) => ({
      ...conversation,
      messages: [...conversation.messages, message],
    }));
  }
}
