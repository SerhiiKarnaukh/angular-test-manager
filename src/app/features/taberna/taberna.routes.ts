import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';
import { StubPageComponent } from '@shared/pages/stub-page/stub-page.component';

import { MainTabernaLayoutComponent } from './layouts/main-taberna-layout/main-taberna-layout.component';
import { TabernaLoginPageComponent } from './profiles/pages/taberna-login-page/taberna-login-page.component';
import { TabernaSignupPageComponent } from './profiles/pages/taberna-signup-page/taberna-signup-page.component';

export const TABERNA_ROUTES: Routes = [
  {
    path: '',
    component: MainTabernaLayoutComponent,
    children: [
      {
        path: 'taberna',
        component: StubPageComponent,
        data: { pageTitle: 'Taberna Home' },
      },
      {
        path: 'taberna/signup',
        component: TabernaSignupPageComponent,
      },
      {
        path: 'taberna/login',
        component: TabernaLoginPageComponent,
      },
      {
        path: 'taberna/dashboard',
        component: StubPageComponent,
        canActivate: [authGuard],
        data: { pageTitle: 'Taberna Dashboard', authJWT: true },
      },
      {
        path: 'taberna-store/category/:category_slug/:product_slug',
        component: StubPageComponent,
        data: { pageTitle: 'Product Detail' },
      },
      {
        path: 'taberna-store/category/:category_slug',
        component: StubPageComponent,
        data: { pageTitle: 'Category Detail' },
      },
      {
        path: 'taberna/search',
        component: StubPageComponent,
        data: { pageTitle: 'Taberna Search' },
      },
      {
        path: 'taberna/cart',
        component: StubPageComponent,
        data: { pageTitle: 'Taberna Cart' },
      },
      {
        path: 'taberna/cart/checkout',
        component: StubPageComponent,
        canActivate: [authGuard],
        data: { pageTitle: 'Taberna Checkout', authJWT: true },
      },
      {
        path: 'taberna/cart/success',
        component: StubPageComponent,
        data: { pageTitle: 'Order Success' },
      },
      {
        path: 'taberna/cart/failed',
        component: StubPageComponent,
        data: { pageTitle: 'Order Failed' },
      },
    ],
  },
];
