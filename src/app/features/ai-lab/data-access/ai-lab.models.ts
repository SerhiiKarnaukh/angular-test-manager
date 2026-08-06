import { HttpErrorResponse } from '@angular/common/http';

export interface AiLabTextResponse {
  message: string;
}

export interface AiLabUploadResponse {
  uploaded_images: string[];
}

export interface RealtimeTokenResponse {
  client_secret: {
    value: string;
  };
}

export interface RealtimeChatMessage {
  sender: 'me' | 'chat';
  message: string;
}

export interface PromptImageUpload {
  file: File;
}

export const REALTIME_WS_URL = 'wss://api.openai.com/v1/realtime?model=gpt-realtime-2.1';

export const PROMPT_IMAGE_MAX_BYTES = 20 * 1024 * 1024;
export const PROMPT_IMAGE_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'] as const;

export type PromptFormMode = 'chat' | 'image' | 'voice' | 'realtime';

export const OPENAI_QUOTA_EXCEEDED_CODE = 'openai_quota_exceeded';

const ADMIN_CONTACT_SUFFIX =
  ' Please contact the site administrator if the issue persists.';

export interface AiLabApiErrorBody {
  message?: string;
  error_code?: string;
  details?: unknown;
}

export function isOpenAiQuotaExceeded(
  status: number | undefined,
  errorCode: string | undefined,
): boolean {
  return status === 402 || errorCode === OPENAI_QUOTA_EXCEEDED_CODE;
}

export function resolveAiLabApiErrorMessage(error: unknown): string | null {
  const { body, status } = extractHttpErrorPayload(error);
  if (!body?.message) {
    return null;
  }

  if (isOpenAiQuotaExceeded(status, body.error_code)) {
    return body.message;
  }

  return `${body.message}${ADMIN_CONTACT_SUFFIX}`;
}

function extractHttpErrorPayload(error: unknown): {
  body: AiLabApiErrorBody | null;
  status: number | undefined;
} {
  if (error instanceof HttpErrorResponse) {
    const body =
      typeof error.error === 'object' && error.error !== null
        ? (error.error as AiLabApiErrorBody)
        : null;

    return { body, status: error.status };
  }

  if (error && typeof error === 'object' && 'error' in error) {
    const candidate = error as { error?: AiLabApiErrorBody; status?: number };
    return { body: candidate.error ?? null, status: candidate.status };
  }

  return { body: null, status: undefined };
}

export function parseRealtimeAssistantMessage(data: {
  type?: string;
  response?: { output?: { content?: { transcript?: string; text?: string }[] }[] };
}): string | null {
  if (data.type !== 'response.done') {
    return null;
  }

  const content = data.response?.output?.[0]?.content?.[0];
  return content?.transcript || content?.text || null;
}

export function extractFilenameFromUrl(imageUrl: string): string {
  const encodedFilename = imageUrl.split('/').pop() ?? '';
  return decodeURIComponent(encodedFilename);
}
