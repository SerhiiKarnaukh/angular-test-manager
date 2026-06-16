# Taberna eCommerce (Angular)

E-commerce frontend: product catalog, shopping cart, Stripe checkout, and order dashboard. Angular Material UI with signal stores and Reactive Forms validation.

### Live Demo: <https://angular.karnaukh-webdev.com/taberna>

![Taberna screenshot](./angular_taberna.jpg)

## Table of Contents

- [Key Features](#key-features)
- [Pages and Routes](#pages-and-routes)
- [Architecture](#architecture)
- [State Management](#state-management)
- [API Endpoints](#api-endpoints)
- [Stripe Integration](#stripe-integration)
- [Authentication](#authentication)
- [Backend](#backend)

## Key Features

- **Product catalog** — Latest products, categories, product detail with variations.
- **Shopping cart** — Guest cart via `cartId` in `localStorage`; merge on login.
- **Checkout** — Billing form + Stripe session or charge mode.
- **Dashboard** — Order history for authenticated users.
- **Search** — Navbar dialog → `/taberna/search`.
- **JWT auth** — Taberna-specific token endpoint; guarded checkout and dashboard.
- **Theme toggle** — Shared `ThemeService`.

## Pages and Routes

| Route | Component | Auth | Description |
| ----- | --------- | ---- | ----------- |
| `/taberna` | `ProductHomePageComponent` | No | Latest products |
| `/taberna-store/category/:category_slug` | `CategoryDetailPageComponent` | No | Category products |
| `/taberna-store/category/:category_slug/:product_slug` | `ProductDetailPageComponent` | No | Detail + add to cart |
| `/taberna/search` | `TabernaSearchPageComponent` | No | Search results |
| `/taberna/cart` | `CartPageComponent` | No | Cart summary |
| `/taberna/cart/checkout` | `CheckoutPageComponent` | **Yes** | Billing + Stripe |
| `/taberna/cart/success` | `OrderSuccessPageComponent` | No | Payment success |
| `/taberna/cart/failed` | `OrderFailedPageComponent` | No | Payment failed |
| `/taberna/dashboard` | `TabernaDashboardPageComponent` | **Yes** | Order history |
| `/taberna/login` | `TabernaLoginPageComponent` | No | Login |
| `/taberna/signup` | `TabernaSignupPageComponent` | No | Signup |

Protected routes use `canActivate: [authGuard]` and `data: { authJWT: true }`.

Layout: `MainTabernaLayoutComponent` (navbar + footer + outlet).

## Architecture

```
src/app/features/taberna/
├── README.md
├── angular_taberna.jpg
├── taberna.routes.ts
├── taberna-theme.scss
├── components/
│   ├── taberna-navbar/
│   ├── taberna-footer/
│   ├── product-card/
│   └── products-grid/
├── data-access/
│   ├── taberna-product.api.service.ts
│   └── taberna-product.store.ts
├── cart/
│   ├── data-access/taberna-cart.*
│   ├── components/cart-item/
│   └── pages/cart-page/
├── orders/
│   ├── data-access/taberna-orders.*, stripe-checkout.service.ts
│   ├── components/checkout-order-summary/
│   └── pages/checkout-page/, order-success-page/, order-failed-page/
├── profiles/
│   ├── data-access/taberna-profile.*
│   ├── components/order-summary/
│   └── pages/dashboard-page/, taberna-login-page/, taberna-signup-page/
├── layouts/main-taberna-layout/
└── pages/                          # catalog + search pages
```

## State Management

| Store | Responsibility |
| ----- | -------------- |
| `TabernaProductStore` | Latest products, category, detail, search |
| `TabernaCartStore` | Cart lines, totals, `cartId` persistence |
| `TabernaOrdersStore` | Stripe place order, payment status |
| `TabernaProfileStore` | Dashboard order list |

## API Endpoints

### Products

| Method | Endpoint |
| ------ | -------- |
| GET | `/taberna-store/api/v1/latest-products/` |
| GET | `/taberna-store/api/v1/products/:category_slug/` |
| GET | `/taberna-store/api/v1/products/:category/:product` |
| GET | `/taberna-store/api/v1/product-categories/` |
| POST | `/taberna-store/api/v1/products/search/` |

### Cart

| Method | Endpoint |
| ------ | -------- |
| GET | `/taberna-cart/api/cart/` |
| POST | `/taberna-cart/api/add-to-cart/:productId/` |
| DELETE | `/taberna-cart/api/cart-remove/:productId/:cartItemId/` |
| DELETE | `/taberna-cart/api/cart-item-remove/:productId/:cartItemId/` |

### Orders

| Method | Endpoint |
| ------ | -------- |
| POST | `/taberna-orders/api/v1/place_order_stripe_session/` |
| POST | `/taberna-orders/api/v1/place_order_stripe_charge/` |
| POST | `/taberna-orders/api/v1/order_payment_success/` |
| POST | `/taberna-orders/api/v1/order_payment_failed/` |
| GET | `/taberna-profiles/api/v1/orders/` |

## Stripe Integration

Controlled by `environment.stripeActionType` (`session` | `charge`).

### Session mode

1. Submit billing form → `place_order_stripe_session`.
2. Redirect to Stripe `checkout_url`.
3. Return to success/failed with `session_id`; confirm via backend.

### Charge mode

1. Mount Stripe Elements on checkout.
2. `stripe.createToken()` client-side.
3. POST token + billing to `place_order_stripe_charge`.

Service: `StripeCheckoutService`.

## Authentication

| Step | Behaviour |
| ---- | --------- |
| Signup | `POST /taberna-profiles/api/register/` |
| Login | `POST /taberna-profiles/api/v1/token/`; sends `cartId` for merge |
| Guards | Checkout + dashboard → `/taberna/login?redirect=...&message=auth` |
| Logout | Clears tokens; refreshes anonymous cart |

Shared forms: `AuthLoginFormComponent`, `AuthSignupFormComponent`.

## Backend

[Taberna Backend (Django DRF)](https://karnaukh-webdev.com/category/django/taberna-drf-ecommerce/)
