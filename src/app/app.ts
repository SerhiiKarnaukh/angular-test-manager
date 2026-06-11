import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoadingService } from '@core/loading/loading.service';
import { AppMessageComponent } from '@shared/ui/app-message/app-message.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppMessageComponent, MatProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly loading = inject(LoadingService);
}
