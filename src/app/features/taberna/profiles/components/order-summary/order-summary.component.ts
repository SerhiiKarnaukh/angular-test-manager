import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { TabernaOrderProductLine, TabernaUserOrder } from '@features/taberna/profiles/data-access/taberna-profile.models';

@Component({
  selector: 'app-order-summary',
  imports: [MatCardModule, RouterLink, DecimalPipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummaryComponent {
  readonly order = input.required<TabernaUserOrder>();

  protected lineTotal(item: TabernaOrderProductLine): number {
    return item.quantity * item.product_price;
  }
}
