import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fromEvent } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { SocialChatStore } from '@features/social/chat/data-access/social-chat.store';
import { CreatePostFormComponent } from '@features/social/posts/components/create-post-form/create-post-form.component';
import { SocialPostCardComponent } from '@features/social/posts/components/social-post-card/social-post-card.component';
import { TrendsComponent } from '@features/social/posts/components/trends/trends.component';
import { SOCIAL_DEFAULT_AVATAR } from '@features/social/posts/data-access/social-post.models';
import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';
import { isPageBottomReached } from '@features/social/posts/utils/scroll.utils';
import { PeopleYouMayKnowComponent } from '@features/social/profiles/components/people-you-may-know/people-you-may-know.component';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';
import { PostListSkeletonComponent } from '@shared/ui/post-list-skeleton/post-list-skeleton.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    RouterLink,
    CreatePostFormComponent,
    SocialPostCardComponent,
    PeopleYouMayKnowComponent,
    TrendsComponent,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    PostListSkeletonComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private readonly postsStore = inject(SocialPostsStore);
  private readonly profileStore = inject(SocialProfileStore);
  private readonly chatStore = inject(SocialChatStore);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly posts = this.postsStore.profilePostList;
  protected readonly profile = this.postsStore.viewedProfile;
  protected readonly isLoading = this.postsStore.isLoading;
  protected readonly canSendFriendshipRequest = this.postsStore.canSendFriendshipRequest;
  protected readonly isPaginationLoading = this.postsStore.isPaginationLoading;
  protected readonly currentUser = this.profileStore.user;
  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected readonly defaultAvatar = SOCIAL_DEFAULT_AVATAR;
  protected readonly profileLoaded = signal(false);

  protected readonly isOwnProfile = computed(() => {
    const user = this.currentUser();
    const viewed = this.profile();
    return !!user && !!viewed && user.id === viewed.id;
  });

  protected readonly profileName = computed(() => {
    const viewed = this.profile();
    if (!viewed) {
      return '';
    }

    return `${viewed.first_name} ${viewed.last_name}`;
  });

  ngOnInit(): void {
    void this.profileStore.loadUserData();
    this.initInfiniteScroll();

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      void this.loadProfile();
    });
  }

  protected async sendFriendshipRequest(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      return;
    }

    const sent = await this.profileStore.sendFriendshipRequest(slug);
    if (sent) {
      this.postsStore.setCanSendFriendshipRequest(false);
    }
  }

  protected async sendMessage(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      return;
    }

    try {
      await this.chatStore.getOrCreateChat(slug);
      await this.router.navigateByUrl('/social/chat');
    } catch (error) {
      console.error(error);
    }
  }

  private initInfiniteScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    fromEvent(window, 'scroll', { passive: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadNextPageIfNeeded());
  }

  private loadNextPageIfNeeded(): void {
    const nextPage = this.postsStore.profilePostListNextPage();
    if (!nextPage || this.postsStore.isPaginationLoading()) {
      return;
    }

    if (isPageBottomReached()) {
      void this.postsStore.loadNextProfilePostsPage(nextPage);
    }
  }

  private async loadProfile(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      return;
    }

    this.profileLoaded.set(false);
    await this.postsStore.loadProfilePosts(slug);
    this.profileLoaded.set(true);

    const viewed = this.profile();
    if (viewed?.full_name) {
      this.title.setTitle(`${viewed.full_name} | Social Network`);
    } else if (viewed) {
      this.title.setTitle(`${viewed.first_name} ${viewed.last_name} | Social Network`);
    }
  }
}
