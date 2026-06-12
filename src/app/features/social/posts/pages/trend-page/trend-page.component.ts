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
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fromEvent } from 'rxjs';

import { PeopleYouMayKnowComponent } from '@features/social/profiles/components/people-you-may-know/people-you-may-know.component';
import { SocialPageLayoutComponent } from '@features/social/posts/components/social-page-layout/social-page-layout.component';
import { SocialPostCardComponent } from '@features/social/posts/components/social-post-card/social-post-card.component';
import { TrendsComponent } from '@features/social/posts/components/trends/trends.component';
import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';
import { isPageBottomReached } from '@features/social/posts/utils/scroll.utils';

@Component({
  selector: 'app-trend-page',
  imports: [
    SocialPageLayoutComponent,
    SocialPostCardComponent,
    PeopleYouMayKnowComponent,
    TrendsComponent,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './trend-page.component.html',
  styleUrl: './trend-page.component.scss',
})
export class TrendPageComponent implements OnInit {
  private readonly store = inject(SocialPostsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly posts = this.store.trendPosts;
  protected readonly isLoading = this.store.isLoading;
  protected readonly isPaginationLoading = this.store.isPaginationLoading;

  ngOnInit(): void {
    this.title.setTitle('Trends | Social Network');
    this.initInfiniteScroll();

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      void this.loadTrendPosts();
    });
  }

  protected trendId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
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
    const nextPage = this.store.trendNextPage();
    if (!nextPage || this.store.isPaginationLoading()) {
      return;
    }

    if (isPageBottomReached()) {
      void this.store.loadNextTrendPage(nextPage);
    }
  }

  private loadTrendPosts(): void {
    const trendId = this.route.snapshot.paramMap.get('id');
    if (!trendId) {
      return;
    }

    void this.store.loadTrendPosts(trendId);
  }
}
