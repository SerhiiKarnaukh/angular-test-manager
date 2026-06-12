import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { OrderSummaryComponent } from '@features/taberna/profiles/components/order-summary/order-summary.component';
import { TabernaProfileStore } from '@features/taberna/profiles/data-access/taberna-profile.store';

@Component({
  selector: 'app-taberna-dashboard-page',
  imports: [MatProgressBarModule, MatCardModule, OrderSummaryComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class TabernaDashboardPageComponent implements OnInit {
  private readonly profileStore = inject(TabernaProfileStore);
  private readonly title = inject(Title);

  protected readonly orders = this.profileStore.orders;
  protected readonly isLoading = this.profileStore.isLoading;
  protected readonly hasOrders = this.profileStore.hasOrders;

  ngOnInit(): void {
    this.title.setTitle('My Orders | Taberna');
    void this.profileStore.loadMyOrders();
  }
}
