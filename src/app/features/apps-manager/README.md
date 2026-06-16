# Apps Manager (Angular)

Portfolio launcher — displays Angular and related projects as cards with images, descriptions, and links to live demos and detail pages.

### Live Demo: <https://angular.karnaukh-webdev.com>

![Apps Manager screenshot](./angular_apps_manager.jpg)

## Table of Contents

- [Key Features](#key-features)
- [Pages and Routes](#pages-and-routes)
- [Architecture](#architecture)
- [State Management](#state-management)
- [API Endpoints](#api-endpoints)
- [Components](#components)

## Key Features

- **Home grid** — Latest applications from the API with responsive CSS grid.
- **Search** — Dialog in navbar or `/apps_manager/search?query=...` results page.
- **Cross-app navigation** — “All Apps” menu links to Taberna, Social, AI Lab, and Django backend.
- **Theme toggle** — Light/dark via shared `ThemeService` (default light on first visit).
- **404** — Catch-all route renders not-found inside Apps Manager layout.

## Pages and Routes

| Route | Component | Auth | Description |
| ----- | --------- | ---- | ----------- |
| `/` | `HomePageComponent` | No | Hero + application cards |
| `/apps_manager/search` | `SearchPageComponent` | No | Search results |
| `/**` | `NotFoundPageComponent` | No | Not found |

Registered **first** in `app.routes.ts` so `/` is not stolen by other layouts.

## Architecture

```
src/app/features/apps-manager/
├── README.md
├── angular_apps_manager.jpg          # screenshot placeholder
├── apps-manager.routes.ts            # lazy loadComponent per page
├── apps-manager-theme.scss
├── data-access/
│   ├── vue-apps.api.service.ts       # GET /api/v1/angular-apps/
│   ├── apps-manager.store.ts
│   └── vue-app.models.ts
├── components/
│   ├── apps-manager-navbar/
│   ├── apps-manager-footer/
│   ├── apps-manager-search-dialog/
│   ├── app-card/
│   └── apps-grid/
├── layouts/main-apps-manager-layout/
└── pages/
    ├── home-page/
    ├── search-page/
    └── not-found-page/
```

## State Management

**`AppsManagerStore`** (signal-based, `providedIn: 'root'`)

| Signal | Description |
| ------ | ----------- |
| `apps` | Current list (home or search results) |
| `isLoading` | Request in progress |
| `query` | Last search query |

| Method | Description |
| ------ | ----------- |
| `loadApps()` | `GET /api/v1/angular-apps/` |
| `search(query)` | `POST /api/v1/angular-apps/search/` |

Errors surface via `AlertService` + `flattenApiErrors`.

## API Endpoints

| Method | Endpoint | Service method |
| ------ | -------- | -------------- |
| GET | `/api/v1/angular-apps/` | `fetchApps()` |
| POST | `/api/v1/angular-apps/search/` | `searchApps(query)` |

> Vue reference uses `/api/v1/vue-apps/` with the same response shape. This Angular app uses `/api/v1/angular-apps/`.

## Components

### AppsManagerNavbarComponent

Toolbar with brand, “All Apps” menu, search dialog, theme toggle, mobile `mat-menu`.

### AppCardComponent

Card with 3:2 image, title, description (line-clamp), Live Demo + Details actions.

### AppsGridComponent

Responsive 1/2/3 column CSS grid (`max-width: 1600px`).

### AppsManagerSearchDialogComponent

`MatDialog` with query field; navigates to search page on submit.
