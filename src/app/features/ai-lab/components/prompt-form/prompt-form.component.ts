import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import {
  PROMPT_IMAGE_ALLOWED_TYPES,
  PROMPT_IMAGE_MAX_BYTES,
  PromptFormMode,
} from '@features/ai-lab/data-access/ai-lab.models';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

@Component({
  selector: 'app-prompt-form',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './prompt-form.component.html',
  styleUrl: './prompt-form.component.scss',
})
export class PromptFormComponent {
  private readonly router = inject(Router);
  private readonly store = inject(AiLabStore);
  private readonly alert = inject(AlertService);

  protected readonly body = signal('');
  protected readonly promptImages = this.store.promptImages;
  protected readonly uploadingImages = this.store.uploadingImages;

  protected readonly mode = computed(() => this.resolveMode(this.router.url));
  protected readonly showAddImages = computed(() => this.mode() === 'chat');
  protected readonly submitLabel = computed(() =>
    this.mode() === 'image' || this.mode() === 'voice' ? 'Generate' : 'Ask Me',
  );

  protected async submitForm(): Promise<void> {
    const question = this.body().trim();
    if (!question) {
      return;
    }

    this.body.set('');

    switch (this.mode()) {
      case 'image':
        await this.store.generateImage(question);
        break;
      case 'voice':
        await this.store.generateVoice(question);
        break;
      case 'realtime':
        await this.store.sendRealtimeMessage(question);
        break;
      default:
        await this.store.sendChatMessage(question);
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void this.submitForm();
  }

  protected chooseFiles(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  protected async handleFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) {
      return;
    }

    const validFiles = this.filterValidFiles(Array.from(files));
    if (validFiles.length > 0) {
      await this.store.uploadPromptImages(validFiles.map((file) => ({ file })));
    }

    input.value = '';
  }

  protected removeImage(index: number): void {
    void this.store.deletePromptImage(index);
  }

  private resolveMode(url: string): PromptFormMode {
    if (url.includes('/image-generator')) {
      return 'image';
    }

    if (url.includes('/voice-generator')) {
      return 'voice';
    }

    if (url.includes('/realtime-chat')) {
      return 'realtime';
    }

    return 'chat';
  }

  private filterValidFiles(files: File[]): File[] {
    return files.filter((file) => {
      if (!PROMPT_IMAGE_ALLOWED_TYPES.includes(file.type as (typeof PROMPT_IMAGE_ALLOWED_TYPES)[number])) {
        return false;
      }

      if (file.size > PROMPT_IMAGE_MAX_BYTES) {
        this.alert.setMessage({
          value: [`Sorry, the file "${file.name}" size cannot be larger than 20MB`],
          type: 'error',
        });
        return false;
      }

      return true;
    });
  }
}
