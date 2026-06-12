import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SocialChatStore } from '@features/social/chat/data-access/social-chat.store';
import { SocialChatMessage } from '@features/social/chat/data-access/social-chat.models';
import { SOCIAL_DEFAULT_AVATAR } from '@features/social/posts/data-access/social-post.models';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';

@Component({
  selector: 'app-chat-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent implements OnInit, OnDestroy {
  private readonly chatStore = inject(SocialChatStore);
  private readonly profileStore = inject(SocialProfileStore);
  private readonly title = inject(Title);

  protected readonly conversations = this.chatStore.conversations;
  protected readonly activeConversation = this.chatStore.activeConversation;
  protected readonly isLoading = this.chatStore.isLoading;
  protected readonly currentUser = this.profileStore.user;
  protected readonly defaultAvatar = SOCIAL_DEFAULT_AVATAR;

  protected readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit(): void {
    this.title.setTitle('Chat | Social Network');

    const userId = this.currentUser()?.id;
    if (userId) {
      void this.chatStore.loadConversations(userId);
      return;
    }

    void this.profileStore.loadUserData().then(() => {
      const loadedUserId = this.profileStore.user()?.id;
      if (loadedUserId) {
        void this.chatStore.loadConversations(loadedUserId);
      }
    });
  }

  ngOnDestroy(): void {
    this.chatStore.disconnectWebSocket();
  }

  protected isActiveConversation(conversationId: number): boolean {
    return this.activeConversation().id === conversationId;
  }

  protected otherUserName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
  }

  protected isSenderMessage(message: SocialChatMessage): boolean {
    return message.created_by.id === this.currentUser()?.id;
  }

  protected selectConversation(conversationId: number): void {
    const userId = this.currentUser()?.id;
    if (!userId) {
      return;
    }

    void this.chatStore.selectConversation(conversationId, userId);
  }

  protected async submitMessage(): Promise<void> {
    const body = this.messageControl.value.trim();
    if (!body) {
      return;
    }

    try {
      await this.chatStore.sendMessage(body);
      this.messageControl.reset('');
    } catch {
      // Error already logged in store.
    }
  }
}
