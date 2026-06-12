import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';
import {
  SOCIAL_DEFAULT_AVATAR,
  SocialPost,
} from '@features/social/posts/data-access/social-post.models';

@Component({
  selector: 'app-social-post-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './social-post-card.component.html',
  styleUrl: './social-post-card.component.scss',
})
export class SocialPostCardComponent {
  private readonly store = inject(SocialPostsStore);
  private readonly profileStore = inject(SocialProfileStore);
  private readonly auth = inject(AuthService);

  readonly post = input.required<SocialPost>();

  protected readonly defaultAvatar = SOCIAL_DEFAULT_AVATAR;
  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected readonly likesCount = computed(() => this.post().likes_count);

  protected readonly authorName = computed(() => {
    const author = this.post().created_by;
    return `${author.first_name} ${author.last_name}`;
  });

  protected readonly avatarUrl = computed(
    () => this.post().created_by.avatar_url ?? SOCIAL_DEFAULT_AVATAR,
  );

  protected readonly isOwnPost = computed(() => {
    const currentUser = this.profileStore.user();
    return currentUser?.id === this.post().created_by.id;
  });

  protected likePost(): void {
    void this.store.likePost(this.post().id);
  }

  protected reportPost(): void {
    void this.store.reportPost(this.post().id);
  }

  protected deletePost(): void {
    void this.store.deletePost(this.post().id);
  }
}
