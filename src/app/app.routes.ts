import { Routes } from '@angular/router';

import { APPS_MANAGER_ROUTES } from '@features/apps-manager/apps-manager.routes';
import { AI_LAB_ROUTES } from '@features/ai-lab/ai-lab.routes';
import { SOCIAL_ROUTES } from '@features/social/social.routes';
import { TABERNA_ROUTES } from '@features/taberna/taberna.routes';
import { StubPageComponent } from '@shared/pages/stub-page/stub-page.component';

import { MainAppsManagerLayoutComponent } from './features/apps-manager/layouts/main-apps-manager-layout/main-apps-manager-layout.component';

export const routes: Routes = [
  ...TABERNA_ROUTES,
  ...SOCIAL_ROUTES,
  ...AI_LAB_ROUTES,
  ...APPS_MANAGER_ROUTES,
  {
    path: '**',
    component: MainAppsManagerLayoutComponent,
    children: [
      {
        path: '**',
        component: StubPageComponent,
        data: { pageTitle: '404 Not Found' },
      },
    ],
  },
];
