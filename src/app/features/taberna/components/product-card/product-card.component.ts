import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

import { TabernaProduct } from '@features/taberna/data-access/taberna-product.models';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, MatDividerModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  readonly product = input.required<TabernaProduct>();
}
