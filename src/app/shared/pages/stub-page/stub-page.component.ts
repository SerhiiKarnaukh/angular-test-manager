import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stub-page',
  imports: [MatCardModule],
  template: `
    <mat-card class="stub-card">
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle>Phase 1 placeholder — implementation in a later phase</mat-card-subtitle>
      </mat-card-header>
    </mat-card>
  `,
  styles: `
    .stub-card {
      max-width: 720px;
      margin: 1rem auto;
    }
  `,
})
export class StubPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title =
    this.route.snapshot.data['pageTitle'] ?? this.route.snapshot.routeConfig?.path ?? 'Page';
}
