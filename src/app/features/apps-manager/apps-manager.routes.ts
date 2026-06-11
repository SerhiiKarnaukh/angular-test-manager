import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { MainAppsManagerLayoutComponent } from './layouts/main-apps-manager-layout/main-apps-manager-layout.component';

export const APPS_MANAGER_ROUTES: Routes = [
  {
    path: '',
    component: MainAppsManagerLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'apps_manager/search',
        component: SearchPageComponent,
      },
    ],
  },
];

export const APPS_MANAGER_NOT_FOUND_ROUTE: Routes = [
  {
    path: '**',
    component: MainAppsManagerLayoutComponent,
    children: [
      {
        path: '**',
        component: NotFoundPageComponent,
      },
    ],
  },
];
