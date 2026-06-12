import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

import { environment } from '@env/environment';

import { StripeActionType } from './taberna-order.models';

@Injectable({ providedIn: 'root' })
export class StripeCheckoutService {
  private stripePromise: Promise<Stripe | null> | null = null;

  getActionType(): StripeActionType {
    return environment.stripeActionType === 'charge' ? 'charge' : 'session';
  }

  isChargeMode(): boolean {
    return this.getActionType() === 'charge';
  }

  loadStripe(): Promise<Stripe | null> {
    if (!this.stripePromise) {
      this.stripePromise = loadStripe(environment.stripePublicKey);
    }

    return this.stripePromise;
  }

  async mountCardElement(container: HTMLElement): Promise<StripeCardElement> {
    const stripe = await this.loadStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const elements = stripe.elements();
    const card = elements.create('card', { hidePostalCode: true });
    card.mount(container);
    return card;
  }

  async createCardToken(card: StripeCardElement): Promise<string> {
    const stripe = await this.loadStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const result = await stripe.createToken(card);
    if (result.error || !result.token) {
      throw new Error(result.error?.message ?? 'Unable to create Stripe token');
    }

    return result.token.id;
  }
}
