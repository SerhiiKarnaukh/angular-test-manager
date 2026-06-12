import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@core/alert/alert.service';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';

import { SocialNotificationsStore } from './social-notifications.store';

describe('SocialNotificationsStore', () => {
  let store: SocialNotificationsStore;
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
        SocialProfileStore,
      ],
    });

    store = TestBed.inject(SocialNotificationsStore);
    auth = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    store.clearNotificationData();
    httpMock.verify();
    localStorage.clear();
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

  it('loads notifications when authenticated', async () => {
    await authenticateUser();

    const loadPromise = store.loadNotifications();
    httpMock.expectOne('/api/social-notifications/').flush([
      { id: 1, body: 'New like', type_of_notification: 'post_like', post_id: 5 },
    ]);
    await loadPromise;

    expect(store.unreadCount()).toBe(1);
  });

  it('navigates to post after reading comment notification', async () => {
    await authenticateUser();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    TestBed.inject(SocialProfileStore).setUserInfo({
      id: 1,
      username: 'john',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      slug: 'john',
      full_name: 'John Doe',
      avatar_url: null,
    });

    const readPromise = store.readNotification({
      id: 8,
      body: 'Comment',
      type_of_notification: 'post_comment',
      post_id: 44,
    });
    httpMock.expectOne('/api/social-notifications/read/8/').flush({});
    await readPromise;

    expect(navigateSpy).toHaveBeenCalledWith(['/social', 44]);
    expect(store.unreadCount()).toBe(0);
  });
});
