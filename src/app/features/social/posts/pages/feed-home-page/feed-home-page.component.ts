import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fromEvent } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { CreatePostFormComponent } from '@features/social/posts/components/create-post-form/create-post-form.component';
import { SocialPageLayoutComponent } from '@features/social/posts/components/social-page-layout/social-page-layout.component';
import { SocialPostCardComponent } from '@features/social/posts/components/social-post-card/social-post-card.component';
import { PeopleYouMayKnowComponent } from '@features/social/profiles/components/people-you-may-know/people-you-may-know.component';
import { TrendsComponent } from '@features/social/posts/components/trends/trends.component';
import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';
import { isPageBottomReached } from '@features/social/posts/utils/scroll.utils';

@Component({
  selector: 'app-feed-home-page',
  imports: [
    SocialPageLayoutComponent,
    CreatePostFormComponent,
    SocialPostCardComponent,
    PeopleYouMayKnowComponent,
    TrendsComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './feed-home-page.component.html',
  styleUrl: './feed-home-page.component.scss',
})
export class FeedHomePageComponent implements OnInit {
  private readonly store = inject(SocialPostsStore);
  private readonly profileStore = inject(SocialProfileStore);
  private readonly auth = inject(AuthService);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly posts = this.store.postList;
  protected readonly isLoading = this.store.isLoading;
  protected readonly isPaginationLoading = this.store.isPaginationLoading;
  protected readonly isAuthenticated = this.auth.isAuthenticated;

  ngOnInit(): void {
    this.title.setTitle('Home | Social Network');
    void this.store.loadFeed();
    void this.profileStore.loadUserData();
    this.initInfiniteScroll();
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
    const nextPage = this.store.postsNextPage();
    if (!nextPage || this.store.isPaginationLoading()) {
      return;
    }

    if (isPageBottomReached()) {
      void this.store.loadNextFeedPage(nextPage);
    }
  }
}
