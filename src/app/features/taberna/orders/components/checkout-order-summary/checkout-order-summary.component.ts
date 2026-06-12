import { AfterViewInit, Component, ElementRef, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { StripeCardElement } from '@stripe/stripe-js';

import { TabernaCart } from '@features/taberna/cart/data-access/taberna-cart.models';
import { StripeCheckoutService } from '@features/taberna/orders/data-access/stripe-checkout.service';

@Component({
  selector: 'app-checkout-order-summary',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './checkout-order-summary.component.html',
  styleUrl: './checkout-order-summary.component.scss',
})
export class CheckoutOrderSummaryComponent implements AfterViewInit {
  private readonly stripeCheckout = inject(StripeCheckoutService);
  private readonly elementRef = inject(ElementRef);

  readonly cart = input.required<TabernaCart>();
  readonly isChargeMode = input(false);
  readonly isSubmitting = input(false);
  readonly canPay = input(false);

  readonly pay = output<void>();

  private cardElement: StripeCardElement | null = null;

  ngAfterViewInit(): void {
    if (!this.isChargeMode()) {
      return;
    }

    void this.mountCard();
  }

  getCardElement(): StripeCardElement | null {
    return this.cardElement;
  }

  private async mountCard(): Promise<void> {
    const container = this.elementRef.nativeElement.querySelector('#card-element') as HTMLElement | null;
    if (!container) {
      return;
    }

    this.cardElement = await this.stripeCheckout.mountCardElement(container);
  }
}
