import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { VueApp } from '@features/apps-manager/data-access/vue-app.models';

@Component({
  selector: 'app-app-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.scss',
})
export class AppCardComponent {
  readonly application = input.required<VueApp>();
}
