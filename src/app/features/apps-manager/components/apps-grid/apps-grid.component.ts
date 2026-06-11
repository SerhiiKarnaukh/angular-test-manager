import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatGridListModule } from '@angular/material/grid-list';
import { map } from 'rxjs';

import { VueApp } from '@features/apps-manager/data-access/vue-app.models';
import { AppCardComponent } from '@features/apps-manager/components/app-card/app-card.component';

@Component({
  selector: 'app-apps-grid',
  imports: [MatGridListModule, AppCardComponent],
  template: `
    <mat-grid-list [cols]="gridCols()" rowHeight="420px" gutterSize="16px">
      @for (application of apps(); track application.id) {
        <mat-grid-tile>
          <app-app-card [application]="application" />
        </mat-grid-tile>
      }
    </mat-grid-list>
  `,
  styles: `
    :host {
      display: block;
      padding: 0 16px 24px;
    }

    app-app-card {
      width: calc(100% - 8px);
      height: calc(100% - 8px);
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
