import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';
import { StubPageComponent } from '@shared/pages/stub-page/stub-page.component';

import { MainSocialLayoutComponent } from './layouts/main-social-layout/main-social-layout.component';
import { SocialLoginPageComponent } from './profiles/pages/social-login-page/social-login-page.component';
import { SocialSignupPageComponent } from './profiles/pages/social-signup-page/social-signup-page.component';

export const SOCIAL_ROUTES: Routes = [
  {
    path: '',
    component: MainSocialLayoutComponent,
    children: [
      {
        path: 'social/home',
        component: StubPageComponent,
        data: { pageTitle: 'Social Feed' },
      },
      {
        path: 'social/profile/edit',
        component: StubPageComponent,
        canActivate: [authGuard],
        data: { pageTitle: 'Edit Profile', authJWT: true },
      },
      {
        path: 'social/profile/:slug/friends',
        component: StubPageComponent,
        canActivate: [authGuard],
        data: { pageTitle: 'Friends', authJWT: true },
      },
      {
        path: 'social/profile/:slug',
        component: StubPageComponent,
        data: { pageTitle: 'Profile' },
      },
      {
        path: 'social/trends/:id',
        component: StubPageComponent,
        data: { pageTitle: 'Trend' },
      },
      {
        path: 'social/chat',
        component: StubPageComponent,
        canActivate: [authGuard],
        data: { pageTitle: 'Chat', authJWT: true },
      },
      {
        path: 'social/notifications',
        component: StubPageComponent,
        canActivate: [authGuard],
        data: { pageTitle: 'Notifications', authJWT: true },
      },
      {
        path: 'social/search',
        component: StubPageComponent,
        data: { pageTitle: 'Social Search' },
      },
      {
        path: 'social/signup',
        component: SocialSignupPageComponent,
      },
      {
        path: 'social/login',
        component: SocialLoginPageComponent,
      },
      {
        path: 'social/edit/password',
        component: StubPageComponent,
        canActivate: [authGuard],
        data: { pageTitle: 'Edit Password', authJWT: true },
      },
      {
        path: 'social/:id',
        component: StubPageComponent,
        data: { pageTitle: 'Post Detail' },
      },
    ],
  },
];
