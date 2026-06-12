import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TabernaCartStore } from '@features/taberna/cart/data-access/taberna-cart.store';
import { TabernaCartLineItem } from '@features/taberna/cart/data-access/taberna-cart.models';

@Component({
  selector: 'tr[app-cart-item]',
  imports: [RouterLink, MatButtonModule, MatIconModule, DecimalPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  private readonly cartStore = inject(TabernaCartStore);

  readonly item = input.required<TabernaCartLineItem>();

  protected lineTotal(item: TabernaCartLineItem): number {
    return item.quantity * item.product.price;
  }

  protected async decrementQuantity(): Promise<void> {
    const current = this.item();
    await this.cartStore.decrementLine(current.product.id, current.id);
    await this.cartStore.loadCart();
  }

  protected async incrementQuantity(): Promise<void> {
    const current = this.item();
    const color = current.variations.find((v) => v.variation_category === 'color')
      ?.variation_value;
    const size = current.variations.find((v) => v.variation_category === 'size')
      ?.variation_value;

    if (!color || !size) {
      return;
    }

    await this.cartStore.addToCart(current.product.id, color, size);
    await this.cartStore.loadCart();
  }

  protected async removeLine(): Promise<void> {
    const current = this.item();
    await this.cartStore.removeLine(current.product.id, current.id);
    await this.cartStore.loadCart();
  }
}
