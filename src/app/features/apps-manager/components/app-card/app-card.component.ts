import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { VueApp } from '@features/apps-manager/data-access/vue-app.models';

@Component({
  selector: 'app-app-card',
  imports: [MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.scss',
})
export class AppCardComponent {
  readonly application = input.required<VueApp>();
}
