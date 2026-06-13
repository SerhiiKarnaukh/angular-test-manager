import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';

import { AiLabApiService } from './ai-lab.api.service';
import { AiLabRealtimeWebSocketService } from './ai-lab-realtime-websocket.service';
import {
  extractFilenameFromUrl,
  PromptImageUpload,
  RealtimeChatMessage,
  resolveAiLabApiErrorMessage,
} from './ai-lab.models';

@Injectable({ providedIn: 'root' })
export class AiLabStore {
  private readonly api = inject(AiLabApiService);
  private readonly realtimeWs = inject(AiLabRealtimeWebSocketService);
  private readonly loading = inject(LoadingService);
  private readonly alert = inject(AlertService);

  private readonly messageState = signal<string | null>(null);
  private readonly imageUrlState = signal<string | null>(null);
  private readonly voiceMessageState = signal<string | null>(null);
  private readonly promptImagesState = signal<string[]>([]);
  private readonly realtimeMessagesState = signal<RealtimeChatMessage[]>([]);
  private readonly uploadingImagesState = signal(false);

  readonly message = this.messageState.asReadonly();
  readonly imageUrl = this.imageUrlState.asReadonly();
  readonly voiceMessage = this.voiceMessageState.asReadonly();
  readonly promptImages = this.promptImagesState.asReadonly();
  readonly realtimeMessages = this.realtimeMessagesState.asReadonly();
  readonly uploadingImages = this.uploadingImagesState.asReadonly();

  async sendChatMessage(question: string): Promise<void> {
    await this.runRequest(async () => {
      const response = await firstValueFrom(
        this.api.sendChatMessage(question, this.promptImagesState()),
      );
      this.messageState.set(response.message);
    });
  }

  async generateImage(question: string): Promise<void> {
    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.generateImage(question));
      this.imageUrlState.set(response.message);
    });
  }

  async generateVoice(question: string): Promise<void> {
    await this.runRequest(async () => {
      const response = await firstValueFrom(this.api.generateVoice(question));
      this.voiceMessageState.set(response.message);
    });
  }

  async downloadImage(imageUrl: string): Promise<void> {
    const filename = extractFilenameFromUrl(imageUrl);

    try {
      const blob = await firstValueFrom(this.api.downloadImage(filename));
      this.triggerBlobDownload(blob, filename);
    } catch (error) {
      this.setApiError(error);
    }
  }

  async uploadPromptImages(images: PromptImageUpload[]): Promise<void> {
    if (images.length === 0) {
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append('images[]', image.file));

    this.uploadingImagesState.set(true);

    try {
      const response = await firstValueFrom(this.api.uploadVisionImages(formData));
      this.promptImagesState.update((current) => [...current, ...response.uploaded_images]);
    } catch (error) {
      this.setApiError(error);
    } finally {
      this.uploadingImagesState.set(false);
    }
  }

  async deletePromptImage(index: number): Promise<void> {
    const imageUrl = this.promptImagesState()[index];
    if (!imageUrl) {
      return;
    }

    const filename = extractFilenameFromUrl(imageUrl);

    try {
      await firstValueFrom(this.api.deleteVisionImage(filename));
      this.promptImagesState.update((images) => images.filter((_, itemIndex) => itemIndex !== index));
    } catch (error) {
      this.setApiError(error);
    }
  }

  async connectRealtimeSocket(): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.fetchRealtimeToken());
      await this.realtimeWs.connect(response.client_secret.value, (message) => {
        this.appendRealtimeMessage('chat', message);
        this.loading.hide();
      });
    } catch (error) {
      this.setApiError(error);
    }
  }

  async sendRealtimeMessage(question: string): Promise<void> {
    if (!this.realtimeWs.isReady()) {
      await this.connectRealtimeSocket();
    }

    if (!this.realtimeWs.isReady()) {
      return;
    }

    this.appendRealtimeMessage('me', question);
    this.loading.show();
    this.realtimeWs.sendMessage(question);
  }

  disconnectRealtimeSocket(): void {
    this.realtimeWs.disconnect();
  }

  private async runRequest(action: () => Promise<void>): Promise<void> {
    this.loading.show();

    try {
      await action();
    } catch (error) {
      this.setApiError(error);
    } finally {
      this.loading.hide();
    }
  }

  private appendRealtimeMessage(sender: RealtimeChatMessage['sender'], message: string): void {
    this.realtimeMessagesState.update((messages) => [...messages, { sender, message }]);
  }

  private setApiError(error: unknown): void {
    const apiMessage = resolveAiLabApiErrorMessage(error);

    this.alert.setMessage({
      value: [apiMessage ?? 'Request failed. Please try again.'],
      type: 'error',
    });
  }

  private triggerBlobDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
