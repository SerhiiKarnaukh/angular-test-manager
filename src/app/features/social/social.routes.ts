import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';

import { MainSocialLayoutComponent } from './layouts/main-social-layout/main-social-layout.component';

export const SOCIAL_ROUTES: Routes = [
  {
    path: '',
    component: MainSocialLayoutComponent,
    children: [
      {
        path: 'social/home',
        loadComponent: () =>
          import('./posts/pages/feed-home-page/feed-home-page.component').then(
            (m) => m.FeedHomePageComponent,
          ),
      },
      {
        path: 'social/profile/edit',
        loadComponent: () =>
          import('./profiles/pages/edit-profile-page/edit-profile-page.component').then(
            (m) => m.EditProfilePageComponent,
          ),
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/profile/:slug/friends',
        loadComponent: () =>
          import('./profiles/pages/friends-page/friends-page.component').then(
            (m) => m.FriendsPageComponent,
          ),
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/profile/:slug',
        loadComponent: () =>
          import('./profiles/pages/profile-page/profile-page.component').then(
            (m) => m.ProfilePageComponent,
          ),
      },
      {
        path: 'social/trends/:id',
        loadComponent: () =>
          import('./posts/pages/trend-page/trend-page.component').then((m) => m.TrendPageComponent),
      },
      {
        path: 'social/chat',
        loadComponent: () =>
          import('./chat/pages/chat-page/chat-page.component').then((m) => m.ChatPageComponent),
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/notifications',
        loadComponent: () =>
          import('./notifications/pages/notifications-page/notifications-page.component').then(
            (m) => m.NotificationsPageComponent,
          ),
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/search',
        loadComponent: () =>
          import('./posts/pages/social-search-page/social-search-page.component').then(
            (m) => m.SocialSearchPageComponent,
          ),
      },
      {
        path: 'social/signup',
        loadComponent: () =>
          import('./profiles/pages/social-signup-page/social-signup-page.component').then(
            (m) => m.SocialSignupPageComponent,
          ),
      },
      {
        path: 'social/login',
        loadComponent: () =>
          import('./profiles/pages/social-login-page/social-login-page.component').then(
            (m) => m.SocialLoginPageComponent,
          ),
      },
      {
        path: 'social/edit/password',
        loadComponent: () =>
          import('./profiles/pages/edit-password-page/edit-password-page.component').then(
            (m) => m.EditPasswordPageComponent,
          ),
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/:id',
        loadComponent: () =>
          import('./posts/pages/post-detail-page/post-detail-page.component').then(
            (m) => m.PostDetailPageComponent,
          ),
      },
    ],
  },
];
