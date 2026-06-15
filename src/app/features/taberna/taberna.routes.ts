import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';

import { MainTabernaLayoutComponent } from './layouts/main-taberna-layout/main-taberna-layout.component';

export const TABERNA_ROUTES: Routes = [
  {
    path: '',
    component: MainTabernaLayoutComponent,
    children: [
      {
        path: 'taberna',
        loadComponent: () =>
          import('./pages/product-home-page/product-home-page.component').then(
            (m) => m.ProductHomePageComponent,
          ),
      },
      {
        path: 'taberna/signup',
        loadComponent: () =>
          import('./profiles/pages/taberna-signup-page/taberna-signup-page.component').then(
            (m) => m.TabernaSignupPageComponent,
          ),
      },
      {
        path: 'taberna/login',
        loadComponent: () =>
          import('./profiles/pages/taberna-login-page/taberna-login-page.component').then(
            (m) => m.TabernaLoginPageComponent,
          ),
      },
      {
        path: 'taberna/dashboard',
        loadComponent: () =>
          import('./profiles/pages/dashboard-page/dashboard-page.component').then(
            (m) => m.TabernaDashboardPageComponent,
          ),
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'taberna-store/category/:category_slug/:product_slug',
        loadComponent: () =>
          import('./pages/product-detail-page/product-detail-page.component').then(
            (m) => m.ProductDetailPageComponent,
          ),
      },
      {
        path: 'taberna-store/category/:category_slug',
        loadComponent: () =>
          import('./pages/category-detail-page/category-detail-page.component').then(
            (m) => m.CategoryDetailPageComponent,
          ),
      },
      {
        path: 'taberna/search',
        loadComponent: () =>
          import('./pages/taberna-search-page/taberna-search-page.component').then(
            (m) => m.TabernaSearchPageComponent,
          ),
      },
      {
        path: 'taberna/cart',
        loadComponent: () =>
          import('./cart/pages/cart-page/cart-page.component').then((m) => m.CartPageComponent),
      },
      {
        path: 'taberna/cart/checkout',
        loadComponent: () =>
          import('./orders/pages/checkout-page/checkout-page.component').then(
            (m) => m.CheckoutPageComponent,
          ),
        canActivate: [authGuard],
        data: { authJWT: true },
      },
      {
        path: 'taberna/cart/success',
        loadComponent: () =>
          import('./orders/pages/order-success-page/order-success-page.component').then(
            (m) => m.OrderSuccessPageComponent,
          ),
      },
      {
        path: 'taberna/cart/failed',
        loadComponent: () =>
          import('./orders/pages/order-failed-page/order-failed-page.component').then(
            (m) => m.OrderFailedPageComponent,
          ),
      },
    ],
  },
];
