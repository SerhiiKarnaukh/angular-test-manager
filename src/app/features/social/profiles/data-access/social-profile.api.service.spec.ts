import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SocialProfileApiService } from './social-profile.api.service';

describe('SocialProfileApiService', () => {
  let service: SocialProfileApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SocialProfileApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchMe calls current user endpoint', () => {
    service.fetchMe().subscribe();

    const request = httpMock.expectOne('/api/social-profiles/me/');
    expect(request.request.method).toBe('GET');
    request.flush({ id: 1, slug: 'john' });
  });

  it('updateProfile posts multipart form data', () => {
    const formData = new FormData();
    service.updateProfile(formData).subscribe();

    const request = httpMock.expectOne('/api/social-profiles/editprofile/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(formData);
    request.flush({ message: 'Information updated successfully', new_slug: 'john', new_avatar: null });
  });

  it('changePassword posts password payload', () => {
    service.changePassword({ old_password: 'old', new_password1: 'new', new_password2: 'new' }).subscribe();

    const request = httpMock.expectOne('/api/social-profiles/editpassword/');
    expect(request.request.method).toBe('POST');
    request.flush({ message: 'success' });
  });

  it('sendFriendRequest posts to friendship endpoint', () => {
    service.sendFriendRequest('john').subscribe();

    const request = httpMock.expectOne('/api/social-profiles/friends/john/request/');
    expect(request.request.method).toBe('POST');
    request.flush({ message: 'sent' });
  });

  it('fetchFriendsData calls friends endpoint', () => {
    service.fetchFriendsData('john').subscribe();

    const request = httpMock.expectOne('/api/social-profiles/friends/john/');
    expect(request.request.method).toBe('GET');
    request.flush({ requests: [], friends: [], user: { id: 1, slug: 'john' } });
  });

  it('fetchFriendSuggestions calls suggested endpoint', () => {
    service.fetchFriendSuggestions().subscribe();

    const request = httpMock.expectOne('/api/social-profiles/friends/suggested/');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
