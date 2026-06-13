import { Routes } from '@angular/router';

import { AiHomePageComponent } from './pages/ai-home-page/ai-home-page.component';
import { ImageGeneratorPageComponent } from './pages/image-generator-page/image-generator-page.component';
import { RealtimeChatPageComponent } from './pages/realtime-chat-page/realtime-chat-page.component';
import { VoiceGeneratorPageComponent } from './pages/voice-generator-page/voice-generator-page.component';
import { MainAiLabLayoutComponent } from './layouts/main-ai-lab-layout/main-ai-lab-layout.component';

export const AI_LAB_ROUTES: Routes = [
  {
    path: '',
    component: MainAiLabLayoutComponent,
    children: [
      {
        path: 'ai-lab',
        component: AiHomePageComponent,
      },
      {
        path: 'ai-lab/image-generator',
        component: ImageGeneratorPageComponent,
      },
      {
        path: 'ai-lab/voice-generator',
        component: VoiceGeneratorPageComponent,
      },
      {
        path: 'ai-lab/realtime-chat',
        component: RealtimeChatPageComponent,
      },
    ],
  },
];
