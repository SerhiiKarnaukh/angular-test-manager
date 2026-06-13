import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AiLabTextResponse,
  AiLabUploadResponse,
  RealtimeTokenResponse,
} from './ai-lab.models';

@Injectable({ providedIn: 'root' })
export class AiLabApiService {
  private readonly http = inject(HttpClient);

  sendChatMessage(question: string, promptImages: string[]): Observable<AiLabTextResponse> {
    return this.http.post<AiLabTextResponse>('/ai-lab/', {
      question,
      prompt_images: promptImages,
    });
  }

  generateImage(question: string): Observable<AiLabTextResponse> {
    return this.http.post<AiLabTextResponse>('/ai-lab/image-generator/', { question });
  }

  generateVoice(question: string): Observable<AiLabTextResponse> {
    return this.http.post<AiLabTextResponse>('/ai-lab/voice-generator/', { question });
  }

  downloadImage(filename: string): Observable<Blob> {
    return this.http.post('/ai-lab/download-image/', { filename }, { responseType: 'blob' });
  }

  deleteVisionImage(filename: string): Observable<unknown> {
    return this.http.delete('/ai-lab/delete-vision-image/', { body: { filename } });
  }

  uploadVisionImages(formData: FormData): Observable<AiLabUploadResponse> {
    return this.http.post<AiLabUploadResponse>('/ai-lab/upload-vision-images/', formData);
  }

  fetchRealtimeToken(): Observable<RealtimeTokenResponse> {
    return this.http.post<RealtimeTokenResponse>('/ai-lab/realtime-token/', {});
  }
}
