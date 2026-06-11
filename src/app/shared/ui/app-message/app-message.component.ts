import { Component, effect, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertService } from '@core/alert/alert.service';

@Component({
  selector: 'app-message',
  template: '',
})
export class AppMessageComponent {
  private readonly alert = inject(AlertService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      const message = this.alert.message();
      if (!message) {
        return;
      }

      this.snackBar.open(message.value.join('\n'), undefined, {
        duration: 5000,
        panelClass: [`app-message-${message.type}`],
        verticalPosition: 'top',
      });
    });
  }
}
