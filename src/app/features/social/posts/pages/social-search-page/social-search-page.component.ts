import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fromEvent } from 'rxjs';

import { PeopleYouMayKnowComponent } from '@features/social/profiles/components/people-you-may-know/people-you-may-know.component';
import { SocialPageLayoutComponent } from '@features/social/posts/components/social-page-layout/social-page-layout.component';
import { SocialPostCardComponent } from '@features/social/posts/components/social-post-card/social-post-card.component';
import { TrendsComponent } from '@features/social/posts/components/trends/trends.component';
import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';
import { SOCIAL_DEFAULT_AVATAR } from '@features/social/posts/data-access/social-post.models';
import { isPageBottomReached } from '@features/social/posts/utils/scroll.utils';

@Component({
  selector: 'app-social-search-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    SocialPageLayoutComponent,
    SocialPostCardComponent,
    PeopleYouMayKnowComponent,
    TrendsComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './social-search-page.component.html',
  styleUrl: './social-search-page.component.scss',
})
export class SocialSearchPageComponent implements OnInit {
  private readonly store = inject(SocialPostsStore);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly posts = this.store.searchPosts;
  protected readonly profiles = this.store.searchProfiles;
  protected readonly isPaginationLoading = this.store.isPaginationLoading;
  protected readonly defaultAvatar = SOCIAL_DEFAULT_AVATAR;

  protected readonly queryControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit(): void {
    this.title.setTitle('Search | Social Network');
    this.store.clearSearchResults();
    this.initInfiniteScroll();
  }

  protected submitSearch(): void {
    const query = this.queryControl.value.trim();
    if (!query) {
      return;
    }

    void this.store.search(query);
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
    const nextPage = this.store.searchNextPage();
    if (!nextPage || this.store.isPaginationLoading()) {
      return;
    }

    if (isPageBottomReached()) {
      void this.store.loadNextSearchPage(nextPage);
    }
  }
}
