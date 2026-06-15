import { Component, computed, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SOCIAL_DEFAULT_AVATAR } from '@features/social/posts/data-access/social-post.models';
import { TrendsComponent } from '@features/social/posts/components/trends/trends.component';
import { PeopleYouMayKnowComponent } from '@features/social/profiles/components/people-you-may-know/people-you-may-know.component';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';
import { PostListSkeletonComponent } from '@shared/ui/post-list-skeleton/post-list-skeleton.component';

@Component({
  selector: 'app-friends-page',
  imports: [
    RouterLink,
    PeopleYouMayKnowComponent,
    TrendsComponent,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    PostListSkeletonComponent,
  ],
  templateUrl: './friends-page.component.html',
  styleUrl: './friends-page.component.scss',
})
export class FriendsPageComponent implements OnInit {
  private readonly profileStore = inject(SocialProfileStore);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  protected readonly profile = this.profileStore.currentProfile;
  protected readonly friendshipRequests = this.profileStore.friendshipRequests;
  protected readonly friends = this.profileStore.currentProfileFriends;
  protected readonly isLoading = this.profileStore.isLoading;
  protected readonly defaultAvatar = SOCIAL_DEFAULT_AVATAR;

  protected readonly profileName = computed(() => {
    const viewed = this.profile();
    if (!viewed) {
      return '';
    }

    return `${viewed.first_name} ${viewed.last_name}`;
  });

  ngOnInit(): void {
    this.title.setTitle('Friends | Social Network');

    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      void this.profileStore.loadFriendsData(slug);
    }
  }

  protected handleRequest(status: string, slug: string): void {
    void this.profileStore.handleFriendshipRequest(status, slug);
  }
}
