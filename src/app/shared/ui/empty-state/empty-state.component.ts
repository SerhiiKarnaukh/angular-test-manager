import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state" role="status">
      <h2>{{ title() }}</h2>
      @if (message()) {
        <p>{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    .empty-state {
      text-align: center;
      padding: 32px 16px;
      color: var(--mat-sys-on-surface-variant);
    }

    h2 {
      margin: 0 0 8px;
      font-size: 1.25rem;
      font-weight: 500;
    }

    p {
      margin: 0;
      font-size: 0.95rem;
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input<string>();
}
