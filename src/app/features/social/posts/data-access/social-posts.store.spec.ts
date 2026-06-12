import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlertService } from '@core/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';

import { SocialPostsStore } from './social-posts.store';

describe('SocialPostsStore', () => {
  let store: SocialPostsStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AlertService, AuthService],
    });

    store = TestBed.inject(SocialPostsStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads feed into state', async () => {
    const loadPromise = store.loadFeed();
    const request = httpMock.expectOne('/api/social-posts/');
    request.flush({
      results: { posts: [{ id: 1, body: 'Hello' }] },
      next: '/api/social-posts/?page=2',
    });
    await loadPromise;

    expect(store.postList()).toHaveLength(1);
    expect(store.postsNextPage()).toBe('/api/social-posts/?page=2');
  });

  it('appends next feed page', async () => {
    const initialLoad = store.loadFeed();
    httpMock.expectOne('/api/social-posts/').flush({
      results: { posts: [{ id: 1, body: 'First' }] },
      next: 'http://localhost/api/social-posts/?page=2',
    });
    await initialLoad;

    const nextPageLoad = store.loadNextFeedPage('http://localhost/api/social-posts/?page=2');
    httpMock.expectOne('/api/social-posts/?page=2').flush({
      results: { posts: [{ id: 2, body: 'More' }] },
      next: null,
    });
    await nextPageLoad;

    expect(store.postList()).toHaveLength(2);
  });

  it('loads post detail', async () => {
    const loadPromise = store.loadPost('3');
    const request = httpMock.expectOne('/api/social-posts/3/');
    request.flush({
      post: {
        id: 3,
        body: 'Detail',
        comments: [],
        comments_count: 0,
        likes_count: 0,
        is_private: false,
        created_at_formatted: '1h',
        created_by: {
          id: 1,
          slug: 'john',
          first_name: 'John',
          last_name: 'Doe',
          avatar_url: null,
        },
        attachments: [],
      },
    });
    await loadPromise;

    expect(store.post().body).toBe('Detail');
  });

  it('searches posts and profiles', async () => {
    const searchPromise = store.search('vue');
    const request = httpMock.expectOne('/api/social-posts/search/');
    request.flush({
      results: {
        posts: [{ id: 2, body: 'Vue post' }],
        profiles: [
          {
            id: 3,
            slug: 'jane',
            first_name: 'Jane',
            last_name: 'Doe',
            avatar_url: null,
            friends_count: 1,
            posts_count: 2,
          },
        ],
      },
      next: null,
    });
    await searchPromise;

    expect(store.searchQuery()).toBe('vue');
    expect(store.searchPosts()).toHaveLength(1);
    expect(store.searchProfiles()).toHaveLength(1);
  });

  it('loads trends', async () => {
    const loadPromise = store.loadTrends();
    const request = httpMock.expectOne('/api/social-posts/trends/');
    request.flush([{ id: 'vue', hashtag: 'vue', occurences: 5 }]);
    await loadPromise;

    expect(store.trends()).toHaveLength(1);
  });

  it('increments likes count on successful like', async () => {
    const loadPromise = store.loadFeed();
    httpMock.expectOne('/api/social-posts/').flush({
      results: { posts: [{ id: 5, body: 'Like me', likes_count: 1 }] },
      next: null,
    });
    await loadPromise;

    const likePromise = store.likePost(5);
    httpMock.expectOne('/api/social-posts/5/like/').flush({ message: 'like created' });
    await likePromise;

    expect(store.postList()[0].likes_count).toBe(2);
  });

  it('removes post from lists on delete', async () => {
    const loadPromise = store.loadFeed();
    httpMock.expectOne('/api/social-posts/').flush({
      results: { posts: [{ id: 9, body: 'Delete me' }] },
      next: null,
    });
    await loadPromise;

    const deletePromise = store.deletePost(9);
    httpMock.expectOne('/api/social-posts/9/delete/').flush({});
    await deletePromise;

    expect(store.postList()).toHaveLength(0);
  });

  it('loads profile posts into state', async () => {
    const loadPromise = store.loadProfilePosts('john');
    const request = httpMock.expectOne('/api/social-posts/profile/john/');
    request.flush({
      results: {
        posts: [{ id: 4, body: 'Profile post' }],
        profile: {
          id: 1,
          slug: 'john',
          first_name: 'John',
          last_name: 'Doe',
          avatar_url: null,
          friends_count: 1,
          posts_count: 1,
        },
        can_send_friendship_request: false,
      },
      next: null,
    });
    await loadPromise;

    expect(store.profilePostList()).toHaveLength(1);
    expect(store.viewedProfile()?.slug).toBe('john');
    expect(store.canSendFriendshipRequest()).toBe(false);
  });
});
