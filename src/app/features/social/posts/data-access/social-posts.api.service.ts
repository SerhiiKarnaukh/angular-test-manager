import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  LikePostResponse,
  PaginatedPostsPayload,
  PostDetailResponse,
  ProfilePostsPayload,
  SearchPostsPayload,
  SocialPost,
  SocialTrend,
} from './social-post.models';

const BASE_URL = '/api/social-posts';

@Injectable({ providedIn: 'root' })
export class SocialPostsApiService {
  private readonly http = inject(HttpClient);

  fetchFeed(): Observable<PaginatedPostsPayload> {
    return this.http.get<PaginatedPostsPayload>(`${BASE_URL}/`);
  }

  fetchPaginated(pathAndSearch: string): Observable<PaginatedPostsPayload> {
    return this.http.get<PaginatedPostsPayload>(pathAndSearch);
  }

  fetchTrendPosts(trendId: string): Observable<PaginatedPostsPayload> {
    return this.http.get<PaginatedPostsPayload>(`${BASE_URL}/`, {
      params: { trend: trendId },
    });
  }

  fetchProfilePosts(profileSlug: string): Observable<ProfilePostsPayload> {
    return this.http.get<ProfilePostsPayload>(`${BASE_URL}/profile/${profileSlug}/`);
  }

  fetchPost(postId: string): Observable<PostDetailResponse> {
    return this.http.get<PostDetailResponse>(`${BASE_URL}/${postId}/`);
  }

  createPost(formData: FormData): Observable<SocialPost> {
    return this.http.post<SocialPost>(`${BASE_URL}/create/`, formData);
  }

  addComment(postId: string, body: string): Observable<unknown> {
    return this.http.post(`${BASE_URL}/${postId}/comment/`, { body });
  }

  searchPosts(query: string): Observable<SearchPostsPayload> {
    return this.http.post<SearchPostsPayload>(`${BASE_URL}/search/`, { query });
  }

  fetchSearchPage(pathname: string, searchParams: URLSearchParams): Observable<SearchPostsPayload> {
    return this.http.get<SearchPostsPayload>(`${pathname}?${searchParams.toString()}`);
  }

  fetchTrends(): Observable<SocialTrend[]> {
    return this.http.get<SocialTrend[]>(`${BASE_URL}/trends/`);
  }

  likePost(postId: number): Observable<LikePostResponse> {
    return this.http.post<LikePostResponse>(`${BASE_URL}/${postId}/like/`, {});
  }

  reportPost(postId: number): Observable<unknown> {
    return this.http.post(`${BASE_URL}/${postId}/report/`, {});
  }

  deletePost(postId: number): Observable<unknown> {
    return this.http.delete(`${BASE_URL}/${postId}/delete/`);
  }
}
