# Angular Applications Manager

Feature-parity Angular rewrite of the [Vue Applications Manager](https://github.com/karnaukh-webdev/test-applications-manager-vue) monorepo SPA. Four sub-applications share one Django REST API backend.

| Sub-app | Route prefix | Status |
|---------|--------------|--------|
| **Apps Manager** | `/`, `/apps_manager/*` | Phase 2 complete |
| **Taberna eCommerce** | `/taberna`, `/taberna-store/*` | Phase 3–6 complete (catalog, cart, checkout, dashboard) |
| **Social Network** | `/social/*` | Phase 1 shell → Phase 7–9 |
| **AI Lab** | `/ai-lab/*` | Phase 1 shell → Phase 10 |

**Stack:** Angular 22, Angular Material, standalone components, signal-based stores, HttpClient, Vitest.

Development plan: [docs/angular-frontend-development-plan.md](docs/angular-frontend-development-plan.md)

## Prerequisites

- Node.js 22.x (see `.nvmrc`)
- npm 11+
- Django REST API running locally (optional until Phase 1 integration)

## Quick start

```bash
cp .env.example .env
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Environment

Copy `.env.example` to `.env` for local tooling (`Makefile`). Runtime config lives in `src/environments/`:

| Variable | Purpose |
|----------|---------|
| `remoteHost` | Django REST API base URL |
| `encryptionKey` | CryptoJS AES key for social profile cache |
| `stripePublicKey` | Stripe.js publishable key |
| `stripeActionType` | `session` or `charge` |

Production values are injected at build time via `environment.prod.ts` (Firebase CI in Phase 12).

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server on port 4200 |
| `npm run build` | Production build → `dist/angular-test-manager/browser` |
| `npm run test` | Unit tests (Vitest) |
| `npm run lint` | ESLint |

## Project structure

```
src/app/
├── core/           # Auth, HTTP interceptors, guards (Phase 1)
├── shared/         # UI components, utils, validators
└── features/       # apps-manager, taberna, social, ai-lab
```

Path aliases: `@core/*`, `@shared/*`, `@features/*`, `@env/*`.

## UI & styling

**Base library: [Angular Material](https://material.angular.dev/) only.**

When implementing a screen, open the matching Vue view and map each Vuetify element to the Material counterpart — same role, Material API, **default appearance**:

| Vue (Vuetify) | Angular Material |
|---------------|------------------|
| `v-btn` | `mat-button` / `mat-flat-button` |
| `v-card` | `mat-card` |
| `v-row` / `v-col` | CSS grid / flex |
| `v-text-field` | `mat-form-field` + input |
| `v-dialog` | `MatDialog` |
| … | see full table in [development plan §8](docs/angular-frontend-development-plan.md#80-ui-foundation-mandatory) |

Do **not** copy Vuetify CSS, theme colors, or custom SCSS to mimic the Vue look. Behaviour and layout structure come from Vue; components and styling come from Material defaults.

**Porting conventions** (route order, cards, auth layout, snackbars, tests, Apps Manager patterns): [development plan §8](docs/angular-frontend-development-plan.md#80-ui-foundation-mandatory) (subsections 8.1.1–8.8).

**Buttons:** global **4px** corner radius (`styles.scss`). Paired actions: `mat-stroked-button` + `mat-flat-button color="primary"`. No pill-shaped buttons.

**Tests:** every new component needs a `.component.spec.ts`; API + store tests are mandatory.

## Firebase Hosting

SPA rewrites are configured in `firebase.json`. Deploy workflow will be added in Phase 12.
