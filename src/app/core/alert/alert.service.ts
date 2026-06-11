import { Injectable, signal } from '@angular/core';

import { AlertMessage } from '@core/auth/auth.models';

const AUTO_DISMISS_MS = 5000;

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly messageState = signal<AlertMessage | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  readonly message = this.messageState.asReadonly();

  setMessage(message: AlertMessage): void {
    this.clearDismissTimer();
    this.messageState.set(message);
    this.dismissTimer = setTimeout(() => this.clearMessage(), AUTO_DISMISS_MS);
  }

  clearMessage(): void {
    this.clearDismissTimer();
    this.messageState.set(null);
  }

  private clearDismissTimer(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }
}
