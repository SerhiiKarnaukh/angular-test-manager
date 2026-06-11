import { Routes } from '@angular/router';

import { StubPageComponent } from '@shared/pages/stub-page/stub-page.component';

import { MainAiLabLayoutComponent } from './layouts/main-ai-lab-layout/main-ai-lab-layout.component';

export const AI_LAB_ROUTES: Routes = [
  {
    path: '',
    component: MainAiLabLayoutComponent,
    children: [
      {
        path: 'ai-lab',
        component: StubPageComponent,
        data: { pageTitle: 'AI Lab — Funny Chat' },
      },
      {
        path: 'ai-lab/image-generator',
        component: StubPageComponent,
        data: { pageTitle: 'Image Generator' },
      },
      {
        path: 'ai-lab/voice-generator',
        component: StubPageComponent,
        data: { pageTitle: 'Voice Generator' },
      },
      {
        path: 'ai-lab/realtime-chat',
        component: StubPageComponent,
        data: { pageTitle: 'Realtime Chat' },
      },
    ],
  },
];
