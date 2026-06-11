import { Routes } from '@angular/router';

import { StubPageComponent } from '@shared/pages/stub-page/stub-page.component';

import { MainAppsManagerLayoutComponent } from './layouts/main-apps-manager-layout/main-apps-manager-layout.component';

export const APPS_MANAGER_ROUTES: Routes = [
  {
    path: '',
    component: MainAppsManagerLayoutComponent,
    children: [
      {
        path: '',
        component: StubPageComponent,
        data: { pageTitle: 'Apps Manager Home' },
      },
      {
        path: 'apps_manager/search',
        component: StubPageComponent,
        data: { pageTitle: 'Apps Manager Search' },
      },
    ],
  },
];
