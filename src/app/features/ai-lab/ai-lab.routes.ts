import { Routes } from '@angular/router';

import { MainAiLabLayoutComponent } from './layouts/main-ai-lab-layout/main-ai-lab-layout.component';

export const AI_LAB_ROUTES: Routes = [
  {
    path: '',
    component: MainAiLabLayoutComponent,
    children: [
      {
        path: 'ai-lab',
        loadComponent: () =>
          import('./pages/ai-home-page/ai-home-page.component').then((m) => m.AiHomePageComponent),
      },
      {
        path: 'ai-lab/image-generator',
        loadComponent: () =>
          import('./pages/image-generator-page/image-generator-page.component').then(
            (m) => m.ImageGeneratorPageComponent,
          ),
      },
      {
        path: 'ai-lab/voice-generator',
        loadComponent: () =>
          import('./pages/voice-generator-page/voice-generator-page.component').then(
            (m) => m.VoiceGeneratorPageComponent,
          ),
      },
      {
        path: 'ai-lab/realtime-chat',
        loadComponent: () =>
          import('./pages/realtime-chat-page/realtime-chat-page.component').then(
            (m) => m.RealtimeChatPageComponent,
          ),
      },
    ],
  },
];
