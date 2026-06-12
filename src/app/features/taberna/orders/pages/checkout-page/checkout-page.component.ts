import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AlertService } from '@core/alert/alert.service';
import { TabernaCartStore } from '@features/taberna/cart/data-access/taberna-cart.store';
import { CheckoutOrderSummaryComponent } from '@features/taberna/orders/components/checkout-order-summary/checkout-order-summary.component';
import { toPlaceOrderPayload } from '@features/taberna/orders/data-access/taberna-order.models';
import { StripeCheckoutService } from '@features/taberna/orders/data-access/stripe-checkout.service';
import { TabernaOrdersStore } from '@features/taberna/orders/data-access/taberna-orders.store';
import {
  checkoutAddressLineValidators,
  checkoutCityValidators,
  checkoutCountryValidators,
  checkoutEmailValidators,
  checkoutFirstNameValidators,
  checkoutLastNameValidators,
  checkoutOptionalAddressLineValidators,
  checkoutPhoneValidators,
  checkoutStateValidators,
} from '@shared/validators/checkout.validators';

@Component({
  selector: 'app-checkout-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    CheckoutOrderSummaryComponent,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
  private readonly cartStore = inject(TabernaCartStore);
  private readonly ordersStore = inject(TabernaOrdersStore);
  private readonly stripeCheckout = inject(StripeCheckoutService);
  private readonly title = inject(Title);
  private readonly alert = inject(AlertService);
  private readonly fb = inject(FormBuilder);

  private readonly summary = viewChild(CheckoutOrderSummaryComponent);

  protected readonly cart = this.cartStore.cart;
  protected readonly hasItems = this.cartStore.hasItems;
  protected readonly isSubmitting = this.ordersStore.isLoading;
  protected readonly isChargeMode = this.stripeCheckout.isChargeMode();

  readonly form = this.fb.nonNullable.group({
    first_name: ['', checkoutFirstNameValidators],
    last_name: ['', checkoutLastNameValidators],
    email: ['', checkoutEmailValidators],
    phone: ['', checkoutPhoneValidators],
    address1: ['', checkoutAddressLineValidators],
    address2: ['', checkoutOptionalAddressLineValidators],
    city: ['', checkoutCityValidators],
    state: ['', checkoutStateValidators],
    country: ['', checkoutCountryValidators],
    order_notes: [''],
  });

  ngOnInit(): void {
    this.title.setTitle('Checkout | Taberna');
  }

  protected async submitCheckout(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.hasItems()) {
      return;
    }

    const stripeToken = await this.resolveStripeToken();
    if (stripeToken === undefined) {
      return;
    }

    const payload = toPlaceOrderPayload(this.form.getRawValue(), stripeToken);
    await this.ordersStore.placeOrderStripe(payload, this.stripeCheckout.getActionType());
  }

  protected fieldError(field: keyof typeof this.form.controls): string | null {
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Value is required';
    }
    if (control.errors['email']) {
      return 'Value must be a valid email';
    }
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    }
    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
    }

    return 'Invalid value';
  }

  private async resolveStripeToken(): Promise<string | null | undefined> {
    if (!this.isChargeMode) {
      return null;
    }

    const card = this.summary()?.getCardElement();
    if (!card) {
      return undefined;
    }

    try {
      return await this.stripeCheckout.createCardToken(card);
    } catch (error) {
      this.alert.setMessage({
        value: [error instanceof Error ? error.message : 'Unable to create Stripe token'],
        type: 'error',
      });
      return undefined;
    }
  }
}
