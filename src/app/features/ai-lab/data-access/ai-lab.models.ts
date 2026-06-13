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

export const REALTIME_WS_URL = 'wss://api.openai.com/v1/realtime?model=gpt-realtime';

export const PROMPT_IMAGE_MAX_BYTES = 20 * 1024 * 1024;
export const PROMPT_IMAGE_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'] as const;

export type PromptFormMode = 'chat' | 'image' | 'voice' | 'realtime';

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
