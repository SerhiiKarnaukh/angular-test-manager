import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { VueApp } from '@features/apps-manager/data-access/vue-app.models';

@Component({
  selector: 'app-app-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './app-card.component.html',
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    mat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    img {
      height: 200px;
      object-fit: cover;
    }

    mat-card-actions {
      margin-top: auto;
    }
  `,
})
export class AppCardComponent {
  readonly application = input.required<VueApp>();
}
