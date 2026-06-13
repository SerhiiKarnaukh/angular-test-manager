import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AiLabPageLayoutComponent } from '@features/ai-lab/components/ai-lab-page-layout/ai-lab-page-layout.component';
import { PromptFormComponent } from '@features/ai-lab/components/prompt-form/prompt-form.component';
import { RealtimeChatComponent } from '@features/ai-lab/components/realtime-chat/realtime-chat.component';

@Component({
  selector: 'app-realtime-chat-page',
  imports: [AiLabPageLayoutComponent, RealtimeChatComponent, PromptFormComponent],
  templateUrl: './realtime-chat-page.component.html',
})
export class RealtimeChatPageComponent implements OnInit {
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Realtime Chat | AI Lab');
  }
}
