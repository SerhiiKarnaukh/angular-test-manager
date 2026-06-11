import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-not-found-page',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Page not found!</mat-card-title>
      </mat-card-header>
    </mat-card>
  `,
})
export class NotFoundPageComponent {}
