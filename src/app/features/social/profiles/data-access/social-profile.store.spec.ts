import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';

import { SocialProfileStore } from './social-profile.store';

describe('SocialProfileStore', () => {
  let store: SocialProfileStore;
  let auth: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AlertService,
        AuthService,
      ],
    });

    store = TestBed.inject(SocialProfileStore);
    auth = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  async function authenticateUser(): Promise<void> {
    const loginPromise = auth.login({
      email: 'john@example.com',
      password: 'secret12',
      login_source: 'social',
      activeApp: 'social',
    });
    httpMock.expectOne('/api/social-profiles/api/v1/token/').flush({
      access: 'access-token',
      refresh: 'refresh-token',
    });
    await loginPromise;
  }

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('loads user data and persists encrypted profile fields', async () => {
    await authenticateUser();

    const loadPromise = store.loadUserData();
    const request = httpMock.expectOne('/api/social-profiles/me/');
    request.flush({
      id: 1,
      username: 'john',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      slug: 'john',
      full_name: 'John Doe',
      avatar_url: null,
    });
    await loadPromise;

    expect(store.user()?.slug).toBe('john');
    expect(localStorage.getItem('user.slug')).toBeTruthy();
  });

  it('shows success alert when friend request is sent', async () => {
    const alert = TestBed.inject(AlertService);
    const sendPromise = store.sendFriendshipRequest('jane');
    httpMock.expectOne('/api/social-profiles/friends/jane/request/').flush({ message: 'sent' });
    await sendPromise;

    expect(alert.message()?.value).toEqual(['The request was sent!']);
  });

  it('loads friend suggestions when authenticated', async () => {
    await authenticateUser();

    const loadPromise = store.loadFriendSuggestions();
    const request = httpMock.expectOne('/api/social-profiles/friends/suggested/');
    request.flush([{ id: 2, slug: 'jane', full_name: 'Jane Doe', avatar_url: null }]);
    await loadPromise;

    expect(store.friendSuggestions()).toHaveLength(1);
  });
});
