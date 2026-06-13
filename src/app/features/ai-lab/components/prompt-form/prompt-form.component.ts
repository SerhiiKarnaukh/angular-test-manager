import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
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

const PROMPT_MAX_LENGTH = 500;

class TouchedOnlyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    void form;
    return !!(control && control.invalid && control.touched);
  }
}

@Component({
  selector: 'app-prompt-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedOnlyErrorStateMatcher }],
  templateUrl: './prompt-form.component.html',
  styleUrl: './prompt-form.component.scss',
})
export class PromptFormComponent {
  private readonly router = inject(Router);
  private readonly store = inject(AiLabStore);
  private readonly alert = inject(AlertService);

  protected readonly promptImages = this.store.promptImages;
  protected readonly uploadingImages = this.store.uploadingImages;
  protected readonly isSubmitting = signal(false);

  protected readonly form = new FormGroup({
    prompt: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(PROMPT_MAX_LENGTH)],
    }),
  });

  protected get promptLength(): number {
    return this.form.controls.prompt.value.length;
  }

  protected get showAddImages(): boolean {
    return this.resolveMode() === 'chat';
  }

  protected get submitLabel(): string {
    const mode = this.resolveMode();
    return mode === 'image' || mode === 'voice' ? 'Generate' : 'Ask Me';
  }

  protected async submitForm(): Promise<void> {
    const question = this.form.controls.prompt.value.trim();
    if (!question) {
      this.form.controls.prompt.markAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      await this.dispatchPrompt(question);
      this.resetPromptField();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected promptFieldError(): string | null {
    const control = this.form.controls.prompt;
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Prompt is required';
    }

    if (control.errors['maxlength']) {
      return `Maximum length is ${PROMPT_MAX_LENGTH} characters`;
    }

    return 'Invalid prompt';
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

  private resetPromptField(): void {
    this.form.controls.prompt.setValue('');
    this.form.controls.prompt.markAsPristine();
    this.form.controls.prompt.markAsUntouched();
  }

  private async dispatchPrompt(question: string): Promise<void> {
    switch (this.resolveMode()) {
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

  private resolveMode(): PromptFormMode {
    const url = this.router.url.split('?')[0];

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
