import { Routes } from '@angular/router';

import { APPS_MANAGER_NOT_FOUND_ROUTE, APPS_MANAGER_ROUTES } from '@features/apps-manager/apps-manager.routes';
import { AI_LAB_ROUTES } from '@features/ai-lab/ai-lab.routes';
import { SOCIAL_ROUTES } from '@features/social/social.routes';
import { TABERNA_ROUTES } from '@features/taberna/taberna.routes';

export const routes: Routes = [
  ...APPS_MANAGER_ROUTES,
  ...TABERNA_ROUTES,
  ...SOCIAL_ROUTES,
  ...AI_LAB_ROUTES,
  ...APPS_MANAGER_NOT_FOUND_ROUTE,
];
