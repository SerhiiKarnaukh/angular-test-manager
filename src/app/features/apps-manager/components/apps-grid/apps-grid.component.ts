import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { AppCardComponent } from '@features/apps-manager/components/app-card/app-card.component';
import { VueApp } from '@features/apps-manager/data-access/vue-app.models';

@Component({
  selector: 'app-apps-grid',
  imports: [AppCardComponent],
  template: `
    <div
      class="apps-grid"
      [class.cols-1]="gridCols() === 1"
      [class.cols-2]="gridCols() === 2"
      [class.cols-3]="gridCols() === 3"
    >
      @for (application of apps(); track application.id) {
        <app-app-card [application]="application" />
      }
    </div>
  `,
  styles: `
    .apps-grid {
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
  `,
})
export class AppsGridComponent {
  readonly apps = input.required<VueApp[]>();

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
}
