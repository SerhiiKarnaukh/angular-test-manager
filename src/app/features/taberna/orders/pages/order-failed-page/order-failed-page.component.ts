import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { TabernaOrdersStore } from '@features/taberna/orders/data-access/taberna-orders.store';
import { AuthPageShellComponent } from '@shared/ui/auth-page-shell/auth-page-shell.component';

@Component({
  selector: 'app-order-failed-page',
  imports: [AuthPageShellComponent, MatCardModule],
  template: `
    <app-auth-page-shell>
      <mat-card class="status-card status-card--failed">
        <mat-card-header>
          <mat-card-title>Payment failed</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Payment failed or was cancelled. Please try again later!</p>
        </mat-card-content>
      </mat-card>
    </app-auth-page-shell>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
      width: 100%;
    }

    .status-card {
      width: 100%;
      max-width: 400px;
    }

    .status-card--failed {
      background-color: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }

    mat-card-content p {
      margin: 0;
    }
  `,
})
export class OrderFailedPageComponent implements OnInit {
  private readonly ordersStore = inject(TabernaOrdersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Failed | Taberna');

    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      void this.ordersStore.reportOrderStatus('failed', sessionId);
    }
  }
}
