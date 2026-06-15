import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';

@Component({
  selector: 'app-card-grid-skeleton',
  imports: [MatCardModule],
  template: `
    <div
      class="skeleton-grid"
      role="status"
      aria-label="Loading content"
      [class.cols-1]="gridCols() === 1"
      [class.cols-2]="gridCols() === 2"
      [class.cols-3]="gridCols() === 3"
    >
      @for (item of placeholders(); track item) {
        <mat-card class="skeleton-card">
          <div class="skeleton-image"></div>
          <mat-card-content>
            <div class="skeleton-line skeleton-line-title"></div>
            <div class="skeleton-line skeleton-line-text"></div>
            <div class="skeleton-line skeleton-line-text short"></div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: `
    .skeleton-grid {
      display: grid;
      gap: 16px;
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 48px) 24px;
      box-sizing: border-box;
    }

    .cols-1 {
      grid-template-columns: 1fr;
    }

    .cols-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .skeleton-card {
      overflow: hidden;
    }

    .skeleton-image {
      aspect-ratio: 3 / 2;
      width: 100%;
      background: var(--mat-sys-surface-container-high);
      animation: skeleton-pulse 1.4s ease-in-out infinite;
    }

    .skeleton-line {
      height: 14px;
      border-radius: 4px;
      margin-bottom: 10px;
      background: var(--mat-sys-surface-container-high);
      animation: skeleton-pulse 1.4s ease-in-out infinite;
    }

    .skeleton-line-title {
      width: 70%;
      height: 18px;
    }

    .skeleton-line-text {
      width: 100%;
    }

    .skeleton-line.short {
      width: 55%;
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
export class CardGridSkeletonComponent {
  readonly count = input(6);

  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly gridCols = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(
        map((state) => {
          if (state.breakpoints[Breakpoints.HandsetPortrait]) {
            return 1;
          }
          if (state.breakpoints[Breakpoints.TabletPortrait]) {
            return 2;
          }
          return 3;
        }),
      ),
    { initialValue: 3 },
  );

  protected placeholders(): number[] {
    return Array.from({ length: this.count() }, (_, index) => index);
  }
}
