export type StripeActionType = 'session' | 'charge';

export type OrderPaymentStatus = 'success' | 'failed';

export interface PlaceOrderPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  country: string;
  order_note: string;
  stripe_token: string | null;
}

export interface PlaceOrderSessionResponse {
  checkout_url: string;
}

export interface CheckoutBillingFormValue {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  order_notes: string;
}

export function toPlaceOrderPayload(
  form: CheckoutBillingFormValue,
  stripeToken: string | null,
): PlaceOrderPayload {
  return {
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email,
    phone: form.phone,
    address_line_1: form.address1,
    address_line_2: form.address2,
    city: form.city,
    state: form.state,
    country: form.country,
    order_note: form.order_notes,
    stripe_token: stripeToken,
  };
}
