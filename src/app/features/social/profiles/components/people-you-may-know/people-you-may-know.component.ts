import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';
import { SOCIAL_DEFAULT_AVATAR } from '@features/social/posts/data-access/social-post.models';

@Component({
  selector: 'app-people-you-may-know',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './people-you-may-know.component.html',
  styleUrl: './people-you-may-know.component.scss',
})
export class PeopleYouMayKnowComponent implements OnInit {
  private readonly profileStore = inject(SocialProfileStore);

  protected readonly suggestions = this.profileStore.friendSuggestions;
  protected readonly defaultAvatar = SOCIAL_DEFAULT_AVATAR;

  ngOnInit(): void {
    void this.profileStore.loadFriendSuggestions();
  }
}
