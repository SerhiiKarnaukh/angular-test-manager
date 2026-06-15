import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-post-list-skeleton',
  imports: [MatCardModule],
  template: `
    <div class="post-skeleton-list" role="status" aria-label="Loading posts">
      @for (item of placeholders(); track item) {
        <mat-card class="post-skeleton-card">
          <mat-card-content>
            <div class="skeleton-header">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-lines">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line subtitle"></div>
              </div>
            </div>
            <div class="skeleton-line body"></div>
            <div class="skeleton-line body short"></div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: `
    .post-skeleton-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .skeleton-header {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .skeleton-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--mat-sys-surface-container-high);
      animation: skeleton-pulse 1.4s ease-in-out infinite;
    }

    .skeleton-lines {
      flex: 1;
    }

    .skeleton-line {
      height: 14px;
      border-radius: 4px;
      margin-bottom: 8px;
      background: var(--mat-sys-surface-container-high);
      animation: skeleton-pulse 1.4s ease-in-out infinite;
    }

    .skeleton-line.title {
      width: 40%;
      height: 16px;
    }

    .skeleton-line.subtitle {
      width: 25%;
    }

    .skeleton-line.body {
      width: 100%;
    }

    .skeleton-line.body.short {
      width: 65%;
      margin-bottom: 0;
    }

    @keyframes skeleton-pulse {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.5;
      }
    }
  `,
})
export class PostListSkeletonComponent {
  readonly count = input(3);

  protected placeholders(): number[] {
    return Array.from({ length: this.count() }, (_, index) => index);
  }
}
