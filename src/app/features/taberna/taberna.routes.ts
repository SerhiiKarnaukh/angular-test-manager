import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';

import { MainTabernaLayoutComponent } from './layouts/main-taberna-layout/main-taberna-layout.component';
import { CategoryDetailPageComponent } from './pages/category-detail-page/category-detail-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { ProductHomePageComponent } from './pages/product-home-page/product-home-page.component';
import { CartPageComponent } from './cart/pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './orders/pages/checkout-page/checkout-page.component';
import { OrderFailedPageComponent } from './orders/pages/order-failed-page/order-failed-page.component';
import { OrderSuccessPageComponent } from './orders/pages/order-success-page/order-success-page.component';
import { TabernaSearchPageComponent } from './pages/taberna-search-page/taberna-search-page.component';
import { TabernaDashboardPageComponent } from './profiles/pages/dashboard-page/dashboard-page.component';
import { TabernaLoginPageComponent } from './profiles/pages/taberna-login-page/taberna-login-page.component';
import { TabernaSignupPageComponent } from './profiles/pages/taberna-signup-page/taberna-signup-page.component';

export const TABERNA_ROUTES: Routes = [
  {
    path: '',
    component: MainTabernaLayoutComponent,
    children: [
      {
        path: 'taberna',
        component: ProductHomePageComponent,
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
        component: TabernaDashboardPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'taberna-store/category/:category_slug/:product_slug',
        component: ProductDetailPageComponent,
      },
      {
        path: 'taberna-store/category/:category_slug',
        component: CategoryDetailPageComponent,
      },
      {
        path: 'taberna/search',
        component: TabernaSearchPageComponent,
      },
      {
        path: 'taberna/cart',
        component: CartPageComponent,
      },
      {
        path: 'taberna/cart/checkout',
        component: CheckoutPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'taberna/cart/success',
        component: OrderSuccessPageComponent,
      },
      {
        path: 'taberna/cart/failed',
        component: OrderFailedPageComponent,
      },
    ],
  },
];
