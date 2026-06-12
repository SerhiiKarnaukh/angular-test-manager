import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

import { CartItemComponent } from '@features/taberna/cart/components/cart-item/cart-item.component';
import { TabernaCartStore } from '@features/taberna/cart/data-access/taberna-cart.store';

@Component({
  selector: 'app-cart-page',
  imports: [
    RouterLink,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    CartItemComponent,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit {
  private readonly cartStore = inject(TabernaCartStore);
  private readonly title = inject(Title);

  protected readonly cart = this.cartStore.cart;
  protected readonly hasItems = this.cartStore.hasItems;
  protected readonly isLoading = this.cartStore.isLoading;

  ngOnInit(): void {
    this.title.setTitle('Cart | Taberna');
  }
}
