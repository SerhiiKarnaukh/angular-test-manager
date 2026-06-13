import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LoadingService } from '@core/loading/loading.service';
import { AiLabPageLayoutComponent } from '@features/ai-lab/components/ai-lab-page-layout/ai-lab-page-layout.component';
import { PromptFormComponent } from '@features/ai-lab/components/prompt-form/prompt-form.component';
import { AiTypingIndicatorComponent } from '@features/ai-lab/components/typing-indicator/typing-indicator.component';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

@Component({
  selector: 'app-image-generator-page',
  imports: [
    AiLabPageLayoutComponent,
    PromptFormComponent,
    AiTypingIndicatorComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './image-generator-page.component.html',
  styleUrl: './image-generator-page.component.scss',
})
export class ImageGeneratorPageComponent implements OnInit {
  private readonly store = inject(AiLabStore);
  private readonly loading = inject(LoadingService);
  private readonly title = inject(Title);

  protected readonly isLoading = this.loading.isLoading;
  protected readonly imageUrl = this.store.imageUrl;
  protected readonly errorMessage = this.store.errorMessage;

  ngOnInit(): void {
    this.title.setTitle('Image Generator | AI Lab');
    this.store.clearErrorMessage();
  }

  protected downloadImage(): void {
    const imageUrl = this.imageUrl();
    if (imageUrl) {
      void this.store.downloadImage(imageUrl);
    }
  }
}
