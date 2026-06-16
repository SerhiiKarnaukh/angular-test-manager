# AI Lab (Angular)

AI playground: text chat with optional images, image generation, voice synthesis, and OpenAI Realtime WebSocket conversation.

### Live Demo: <https://angular.karnaukh-webdev.com/ai-lab>

![AI Lab screenshot](./angular_ai_lab.jpg)

## Table of Contents

- [Key Features](#key-features)
- [Pages and Routes](#pages-and-routes)
- [Architecture](#architecture)
- [State Management](#state-management)
- [API Endpoints](#api-endpoints)
- [WebSocket Integration](#websocket-integration)
- [Backend](#backend)

## Key Features

- **Funny Chat** — Text Q&A with optional vision image uploads.
- **Image Generator** — Prompt → generated image with download.
- **Voice Generator** — Prompt → audio player for synthesized speech.
- **Realtime Chat** — Live GPT-4o Realtime via WebSocket.
- **Prompt form** — Shared 500-char limit, JPEG/PNG up to 20 MB validation.
- **Global loading bar** — `LoadingService` during AI requests.
- **Theme toggle** — Shared `ThemeService`.

## Pages and Routes

| Route | Component | Description |
| ----- | --------- | ----------- |
| `/ai-lab` | `AiHomePageComponent` | Text chat + optional images |
| `/ai-lab/image-generator` | `ImageGeneratorPageComponent` | Text-to-image |
| `/ai-lab/voice-generator` | `VoiceGeneratorPageComponent` | Text-to-speech |
| `/ai-lab/realtime-chat` | `RealtimeChatPageComponent` | WebSocket conversation |

Layout: `MainAiLabLayoutComponent` — navbar, footer, realtime socket init on mount.

## Architecture

```
src/app/features/ai-lab/
├── README.md
├── angular_ai_lab.jpg
├── ai-lab.routes.ts
├── ai-lab-theme.scss
├── data-access/
│   ├── ai-lab.api.service.ts
│   ├── ai-lab.store.ts
│   └── ai-lab-realtime-websocket.service.ts
├── components/
│   ├── ai-lab-navbar/
│   ├── ai-lab-footer/
│   ├── prompt-form/
│   ├── typing-indicator/
│   └── realtime-chat/
├── layouts/main-ai-lab-layout/
└── pages/
    ├── ai-home-page/
    ├── image-generator-page/
    ├── voice-generator-page/
    └── realtime-chat-page/
```

## State Management

**`AiLabStore`** + **`AiLabRealtimeWebSocketService`**

| Signal / state | Description |
| -------------- | ----------- |
| `chatMessage` | Last text chat response |
| `imageUrl` | Generated image URL |
| `voiceMessage` | Generated audio URL |
| `promptImages` | Uploaded vision image URLs |
| `realtimeMessages` | Realtime chat history |
| `uploadingImages` | Vision upload in progress |

Uses `LoadingService` for global progress bar during API calls.

## API Endpoints

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| POST | `/ai-lab/` | Chat question + optional images |
| POST | `/ai-lab/image-generator/` | Generate image |
| POST | `/ai-lab/voice-generator/` | Generate voice |
| POST | `/ai-lab/download-image/` | Download image blob |
| POST | `/ai-lab/upload-vision-images/` | Upload vision context |
| DELETE | `/ai-lab/delete-vision-image/` | Remove uploaded image |
| POST | `/ai-lab/realtime-token/` | Ephemeral key for Realtime WS |

## WebSocket Integration

**OpenAI Realtime** (not Django WebSocket):

1. `POST /ai-lab/realtime-token/` → ephemeral key.
2. Connect to `wss://api.openai.com/v1/realtime` with subprotocol headers.
3. Send `conversation.item.create` + `response.create` on user message.
4. Handle `response.done` → append transcript to `realtimeMessages`.

Service: `AiLabRealtimeWebSocketService`. Initialized from `MainAiLabLayoutComponent`.

## Backend

[AI Lab Backend (Django DRF)](https://karnaukh-webdev.com/category/django/ai-lab-back-end/)
