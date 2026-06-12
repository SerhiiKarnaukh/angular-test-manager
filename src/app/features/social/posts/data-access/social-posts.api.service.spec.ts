import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SocialPostsApiService } from './social-posts.api.service';

describe('SocialPostsApiService', () => {
  let service: SocialPostsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SocialPostsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchFeed calls feed endpoint', () => {
    service.fetchFeed().subscribe();

    const request = httpMock.expectOne('/api/social-posts/');
    expect(request.request.method).toBe('GET');
    request.flush({ results: { posts: [] }, next: null });
  });

  it('fetchPost calls post detail endpoint', () => {
    service.fetchPost('42').subscribe();

    const request = httpMock.expectOne('/api/social-posts/42/');
    expect(request.request.method).toBe('GET');
    request.flush({ post: { id: 42 } });
  });

  it('createPost sends multipart form data', () => {
    const formData = new FormData();
    service.createPost(formData).subscribe();

    const request = httpMock.expectOne('/api/social-posts/create/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(formData);
    request.flush({ id: 1 });
  });

  it('addComment posts comment body', () => {
    service.addComment('42', 'hello').subscribe();

    const request = httpMock.expectOne('/api/social-posts/42/comment/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ body: 'hello' });
    request.flush({});
  });

  it('searchPosts posts query to search endpoint', () => {
    service.searchPosts('vue').subscribe();

    const request = httpMock.expectOne('/api/social-posts/search/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ query: 'vue' });
    request.flush({ results: { posts: [], profiles: [] }, next: null });
  });

  it('fetchTrends calls trends endpoint', () => {
    service.fetchTrends().subscribe();

    const request = httpMock.expectOne('/api/social-posts/trends/');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('fetchTrendPosts calls feed with trend query param', () => {
    service.fetchTrendPosts('angular').subscribe();

    const request = httpMock.expectOne('/api/social-posts/?trend=angular');
    expect(request.request.method).toBe('GET');
    request.flush({ results: { posts: [] }, next: null });
  });

  it('likePost posts to like endpoint', () => {
    service.likePost(5).subscribe();

    const request = httpMock.expectOne('/api/social-posts/5/like/');
    expect(request.request.method).toBe('POST');
    request.flush({ message: 'like created' });
  });

  it('reportPost posts to report endpoint', () => {
    service.reportPost(8).subscribe();

    const request = httpMock.expectOne('/api/social-posts/8/report/');
    expect(request.request.method).toBe('POST');
    request.flush({});
  });

  it('deletePost calls delete endpoint', () => {
    service.deletePost(9).subscribe();

    const request = httpMock.expectOne('/api/social-posts/9/delete/');
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });

  it('fetchProfilePosts calls profile endpoint', () => {
    service.fetchProfilePosts('john').subscribe();

    const request = httpMock.expectOne('/api/social-posts/profile/john/');
    expect(request.request.method).toBe('GET');
    request.flush({
      results: {
        posts: [],
        profile: { id: 1, slug: 'john' },
        can_send_friendship_request: true,
      },
      next: null,
    });
  });
});
