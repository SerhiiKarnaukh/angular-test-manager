import { Routes } from '@angular/router';

import { MainAppsManagerLayoutComponent } from './layouts/main-apps-manager-layout/main-apps-manager-layout.component';

export const APPS_MANAGER_ROUTES: Routes = [
  {
    path: '',
    component: MainAppsManagerLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'apps_manager/search',
        loadComponent: () =>
          import('./pages/search-page/search-page.component').then((m) => m.SearchPageComponent),
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
        loadComponent: () =>
          import('./pages/not-found-page/not-found-page.component').then(
            (m) => m.NotFoundPageComponent,
          ),
      },
    ],
  },
];
