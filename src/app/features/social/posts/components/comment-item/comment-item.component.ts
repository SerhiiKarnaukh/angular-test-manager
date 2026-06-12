import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import {
  SOCIAL_DEFAULT_AVATAR,
  SocialComment,
} from '@features/social/posts/data-access/social-post.models';

@Component({
  selector: 'app-comment-item',
  imports: [MatCardModule, RouterLink],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.scss',
})
export class CommentItemComponent {
  readonly comment = input.required<SocialComment>();

  protected readonly defaultAvatar = SOCIAL_DEFAULT_AVATAR;

  protected readonly authorName = computed(() => {
    const author = this.comment().created_by;
    return `${author.first_name} ${author.last_name}`;
  });

  protected readonly avatarUrl = computed(
    () => this.comment().created_by.avatar_url ?? SOCIAL_DEFAULT_AVATAR,
  );
}
