import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { TabernaOrdersStore } from '@features/taberna/orders/data-access/taberna-orders.store';
import { AuthPageShellComponent } from '@shared/ui/auth-page-shell/auth-page-shell.component';

@Component({
  selector: 'app-order-success-page',
  imports: [AuthPageShellComponent, MatCardModule],
  template: `
    <app-auth-page-shell>
      <mat-card class="status-card">
        <mat-card-header>
          <mat-card-title>Thank You!</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Your order will be processed within 48 hours</p>
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

    mat-card-content p {
      margin: 0;
    }
  `,
})
export class OrderSuccessPageComponent implements OnInit {
  private readonly ordersStore = inject(TabernaOrdersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Success | Taberna');

    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      void this.ordersStore.reportOrderStatus('success', sessionId);
    }
  }
}
