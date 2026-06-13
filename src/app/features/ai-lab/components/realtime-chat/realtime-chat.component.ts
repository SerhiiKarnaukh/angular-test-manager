import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LoadingService } from '@core/loading/loading.service';
import { AiTypingIndicatorComponent } from '@features/ai-lab/components/typing-indicator/typing-indicator.component';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

@Component({
  selector: 'app-realtime-chat',
  imports: [MatCardModule, MatIconModule, AiTypingIndicatorComponent],
  templateUrl: './realtime-chat.component.html',
  styleUrl: './realtime-chat.component.scss',
})
export class RealtimeChatComponent {
  private readonly store = inject(AiLabStore);
  private readonly loading = inject(LoadingService);
  private readonly chatArea = viewChild<ElementRef<HTMLElement>>('chatArea');

  protected readonly messages = this.store.realtimeMessages;
  protected readonly isLoading = this.loading.isLoading;

  constructor() {
    effect(() => {
      this.messages();
      this.isLoading();
      queueMicrotask(() => this.scrollToBottom());
    });
  }

  protected isSender(message: { sender: string }): boolean {
    return message.sender === 'me';
  }

  private scrollToBottom(): void {
    const area = this.chatArea()?.nativeElement;
    if (!area) {
      return;
    }

    area.scrollTop = area.scrollHeight;
  }
}
