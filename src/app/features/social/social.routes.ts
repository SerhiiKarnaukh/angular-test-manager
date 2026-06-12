import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';

import { MainSocialLayoutComponent } from './layouts/main-social-layout/main-social-layout.component';
import { ChatPageComponent } from './chat/pages/chat-page/chat-page.component';
import { NotificationsPageComponent } from './notifications/pages/notifications-page/notifications-page.component';
import { FeedHomePageComponent } from './posts/pages/feed-home-page/feed-home-page.component';
import { PostDetailPageComponent } from './posts/pages/post-detail-page/post-detail-page.component';
import { SocialSearchPageComponent } from './posts/pages/social-search-page/social-search-page.component';
import { TrendPageComponent } from './posts/pages/trend-page/trend-page.component';
import { EditPasswordPageComponent } from './profiles/pages/edit-password-page/edit-password-page.component';
import { EditProfilePageComponent } from './profiles/pages/edit-profile-page/edit-profile-page.component';
import { FriendsPageComponent } from './profiles/pages/friends-page/friends-page.component';
import { ProfilePageComponent } from './profiles/pages/profile-page/profile-page.component';
import { SocialLoginPageComponent } from './profiles/pages/social-login-page/social-login-page.component';
import { SocialSignupPageComponent } from './profiles/pages/social-signup-page/social-signup-page.component';

export const SOCIAL_ROUTES: Routes = [
  {
    path: '',
    component: MainSocialLayoutComponent,
    children: [
      {
        path: 'social/home',
        component: FeedHomePageComponent,
      },
      {
        path: 'social/profile/edit',
        component: EditProfilePageComponent,
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/profile/:slug/friends',
        component: FriendsPageComponent,
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/profile/:slug',
        component: ProfilePageComponent,
      },
      {
        path: 'social/trends/:id',
        component: TrendPageComponent,
      },
      {
        path: 'social/chat',
        component: ChatPageComponent,
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/notifications',
        component: NotificationsPageComponent,
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/search',
        component: SocialSearchPageComponent,
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
        component: EditPasswordPageComponent,
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'social/:id',
        component: PostDetailPageComponent,
      },
    ],
  },
];
