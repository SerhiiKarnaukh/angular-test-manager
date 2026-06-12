import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { flattenApiErrors } from '@shared/utils/error.utils';

import { SocialPostsApiService } from './social-posts.api.service';
import {
  EMPTY_SOCIAL_POST_DETAIL,
  getPathAndSearch,
  SelectedPostImage,
  SocialComment,
  SocialPost,
  SocialSearchProfile,
  SocialTrend,
  SocialViewedProfileSummary,
} from './social-post.models';

@Injectable({ providedIn: 'root' })
export class SocialPostsStore {
  private readonly api = inject(SocialPostsApiService);
  private readonly alert = inject(AlertService);

  private readonly postListState = signal<SocialPost[]>([]);
  private readonly profilePostListState = signal<SocialPost[]>([]);
  private readonly postDetailState = signal(EMPTY_SOCIAL_POST_DETAIL);
  private readonly viewedProfileState = signal<SocialViewedProfileSummary | null>(null);
  private readonly canSendFriendshipRequestState = signal<boolean | string>(true);
  private readonly searchPostsState = signal<SocialPost[]>([]);
  private readonly searchProfilesState = signal<SocialSearchProfile[]>([]);
  private readonly searchQueryState = signal('');
  private readonly trendsState = signal<SocialTrend[]>([]);
  private readonly trendPostsState = signal<SocialPost[]>([]);
  private readonly postImagesState = signal<SelectedPostImage[]>([]);
  private readonly postsNextPageState = signal<string | null>(null);
  private readonly profilePostListNextPageState = signal<string | null>(null);
  private readonly searchNextPageState = signal<string | null>(null);
  private readonly trendNextPageState = signal<string | null>(null);
  private readonly loadingState = signal(false);
  private readonly paginationLoadingState = signal(false);

  readonly postList = this.postListState.asReadonly();
  readonly profilePostList = this.profilePostListState.asReadonly();
  readonly post = this.postDetailState.asReadonly();
  readonly viewedProfile = this.viewedProfileState.asReadonly();
  readonly canSendFriendshipRequest = this.canSendFriendshipRequestState.asReadonly();
  readonly searchPosts = this.searchPostsState.asReadonly();
  readonly searchProfiles = this.searchProfilesState.asReadonly();
  readonly searchQuery = this.searchQueryState.asReadonly();
  readonly trends = this.trendsState.asReadonly();
  readonly trendPosts = this.trendPostsState.asReadonly();
  readonly postImages = this.postImagesState.asReadonly();
  readonly postsNextPage = this.postsNextPageState.asReadonly();
  readonly profilePostListNextPage = this.profilePostListNextPageState.asReadonly();
  readonly searchNextPage = this.searchNextPageState.asReadonly();
  readonly trendNextPage = this.trendNextPageState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly isPaginationLoading = this.paginationLoadingState.asReadonly();
  readonly hasPosts = computed(() => this.postListState().length > 0);

  async loadFeed(): Promise<void> {
    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.fetchFeed());
      this.postListState.set(response.results.posts);
      this.postsNextPageState.set(response.next);
    });
  }

  async loadNextFeedPage(url: string): Promise<void> {
    await this.runPaginationRequest(async () => {
      const response = await firstValueFrom(this.api.fetchPaginated(getPathAndSearch(url)));
      this.postListState.update((posts) => [...posts, ...response.results.posts]);
      this.postsNextPageState.set(response.next);
    });
  }

  async loadPost(postId: string): Promise<void> {
    this.postDetailState.set(EMPTY_SOCIAL_POST_DETAIL);

    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.fetchPost(postId));
      this.postDetailState.set(response.post);
    });
  }

  async submitPost(formData: FormData): Promise<void> {
    const images = this.postImagesState();

    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });

    await this.runRequest(async () => {
      const post = await firstValueFrom(this.api.createPost(formData));
      this.prependPost(post);
      this.postImagesState.set([]);
    });
  }

  async submitComment(postId: string, commentBody: string): Promise<void> {
    if (!commentBody.trim()) {
      return;
    }

    try {
      const comment = await firstValueFrom(this.api.addComment(postId, commentBody));
      this.appendComment(comment as SocialComment);
    } catch (error) {
      this.handleError(error);
    }
  }

  async search(query: string): Promise<void> {
    this.searchQueryState.set(query);

    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.searchPosts(query));
      this.searchPostsState.set(response.results.posts);
      this.searchProfilesState.set(response.results.profiles);
      this.searchNextPageState.set(response.next);
    });
  }

  async loadNextSearchPage(url: string): Promise<void> {
    await this.runPaginationRequest(async () => {
      const urlObject = new URL(url);
      const params = new URLSearchParams(urlObject.search);
      params.set('query', this.searchQueryState());

      const response = await firstValueFrom(
        this.api.fetchSearchPage(urlObject.pathname, params),
      );
      this.searchPostsState.update((posts) => [...posts, ...response.results.posts]);
      this.searchProfilesState.set(response.results.profiles);
      this.searchNextPageState.set(response.next);
    });
  }

  async loadTrends(): Promise<void> {
    try {
      const trends = await firstValueFrom(this.api.fetchTrends());
      this.trendsState.set(trends);
    } catch (error) {
      console.error(error);
    }
  }

  async loadTrendPosts(trendId: string): Promise<void> {
    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.fetchTrendPosts(trendId));
      this.trendPostsState.set(response.results.posts);
      this.trendNextPageState.set(response.next);
    });
  }

  async loadNextTrendPage(url: string): Promise<void> {
    await this.runPaginationRequest(async () => {
      const response = await firstValueFrom(this.api.fetchPaginated(getPathAndSearch(url)));
      this.trendPostsState.update((posts) => [...posts, ...response.results.posts]);
      this.trendNextPageState.set(response.next);
    });
  }

  async loadProfilePosts(profileSlug: string): Promise<void> {
    this.viewedProfileState.set(null);

    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.fetchProfilePosts(profileSlug));
      this.profilePostListState.set(response.results.posts);
      this.viewedProfileState.set(response.results.profile);
      this.canSendFriendshipRequestState.set(response.results.can_send_friendship_request);
      this.profilePostListNextPageState.set(response.next);
    });
  }

  async loadNextProfilePostsPage(url: string): Promise<void> {
    await this.runPaginationRequest(async () => {
      const response = await firstValueFrom(this.api.fetchPaginated(getPathAndSearch(url)));
      this.profilePostListState.update((posts) => [...posts, ...response.results.posts]);
      this.profilePostListNextPageState.set(response.next);
    });
  }

  setCanSendFriendshipRequest(value: boolean | string): void {
    this.canSendFriendshipRequestState.set(value);
  }

  async likePost(postId: number): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.likePost(postId));
      if (response.message === 'like created') {
        this.incrementLikesCount(postId);
      }
    } catch {
      this.alert.setMessage({ value: ['You must be logged in!'], type: 'error' });
    }
  }

  async reportPost(postId: number): Promise<void> {
    try {
      await firstValueFrom(this.api.reportPost(postId));
      this.alert.setMessage({ value: ['The post was reported'], type: 'success' });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deletePost(postId: number): Promise<void> {
    this.removePostFromLists(postId);

    try {
      await firstValueFrom(this.api.deletePost(postId));
      this.alert.setMessage({ value: ['The post was deleted'], type: 'success' });
    } catch (error) {
      this.handleError(error);
    }
  }

  setPostImages(images: SelectedPostImage[]): void {
    if (images.length === 0) {
      this.postImagesState.set([]);
      return;
    }

    this.postImagesState.update((current) => [...current, ...images]);
  }

  clearSearchResults(): void {
    this.searchPostsState.set([]);
    this.searchProfilesState.set([]);
    this.searchQueryState.set('');
    this.searchNextPageState.set(null);
  }

  private prependPost(post: SocialPost): void {
    this.postListState.update((posts) => [post, ...posts]);
    this.profilePostListState.update((posts) => [post, ...posts]);
    this.incrementViewedProfilePostsCount();
  }

  private appendComment(comment: SocialComment): void {
    this.postDetailState.update((post) => ({
      ...post,
      comments: [...post.comments, comment],
      comments_count: post.comments_count + 1,
    }));
  }

  private incrementLikesCount(postId: number): void {
    const updatePost = (post: SocialPost): SocialPost =>
      post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post;

    this.postListState.update((posts) => posts.map(updatePost));
    this.searchPostsState.update((posts) => posts.map(updatePost));
    this.trendPostsState.update((posts) => posts.map(updatePost));
    this.profilePostListState.update((posts) => posts.map(updatePost));
    this.postDetailState.update((post) =>
      post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post,
    );
  }

  private removePostFromLists(postId: number): void {
    const filterPosts = (posts: SocialPost[]) => posts.filter((post) => post.id !== postId);

    this.postListState.update(filterPosts);
    this.searchPostsState.update(filterPosts);
    this.trendPostsState.update(filterPosts);
    this.profilePostListState.update(filterPosts);
    this.decrementViewedProfilePostsCount();

    if (this.postDetailState().id === postId) {
      this.postDetailState.set(EMPTY_SOCIAL_POST_DETAIL);
    }
  }

  private incrementViewedProfilePostsCount(): void {
    this.viewedProfileState.update((profile) =>
      profile ? { ...profile, posts_count: profile.posts_count + 1 } : profile,
    );
  }

  private decrementViewedProfilePostsCount(): void {
    this.viewedProfileState.update((profile) =>
      profile ? { ...profile, posts_count: Math.max(0, profile.posts_count - 1) } : profile,
    );
  }

  private async runRequest(action: () => Promise<void>): Promise<void> {
    this.loadingState.set(true);

    try {
      await action();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.loadingState.set(false);
    }
  }

  private async runPaginationRequest(action: () => Promise<void>): Promise<void> {
    this.paginationLoadingState.set(true);

    try {
      await action();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.paginationLoadingState.set(false);
    }
  }

  private handleError(error: unknown): void {
    const body = (error as { error?: Record<string, unknown> })?.error;
    if (body && typeof body === 'object') {
      this.alert.setMessage({ value: flattenApiErrors(body), type: 'error' });
      return;
    }

    console.error(error);
  }
}
