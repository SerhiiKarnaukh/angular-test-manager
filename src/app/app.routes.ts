import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@features/apps-manager/apps-manager.routes').then((m) => m.APPS_MANAGER_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('@features/taberna/taberna.routes').then((m) => m.TABERNA_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('@features/social/social.routes').then((m) => m.SOCIAL_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('@features/ai-lab/ai-lab.routes').then((m) => m.AI_LAB_ROUTES),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@features/apps-manager/apps-manager.routes').then(
        (m) => m.APPS_MANAGER_NOT_FOUND_ROUTE,
      ),
  },
];
