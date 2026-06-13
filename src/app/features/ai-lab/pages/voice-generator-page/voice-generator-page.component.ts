import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LoadingService } from '@core/loading/loading.service';
import { AiLabPageLayoutComponent } from '@features/ai-lab/components/ai-lab-page-layout/ai-lab-page-layout.component';
import { PromptFormComponent } from '@features/ai-lab/components/prompt-form/prompt-form.component';
import { AiTypingIndicatorComponent } from '@features/ai-lab/components/typing-indicator/typing-indicator.component';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

@Component({
  selector: 'app-voice-generator-page',
  imports: [
    AiLabPageLayoutComponent,
    PromptFormComponent,
    AiTypingIndicatorComponent,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './voice-generator-page.component.html',
  styleUrl: './voice-generator-page.component.scss',
})
export class VoiceGeneratorPageComponent implements OnInit {
  private readonly store = inject(AiLabStore);
  private readonly loading = inject(LoadingService);
  private readonly title = inject(Title);

  protected readonly isLoading = this.loading.isLoading;
  protected readonly voiceMessage = this.store.voiceMessage;

  ngOnInit(): void {
    this.title.setTitle('Voice Generator | AI Lab');
  }
}
