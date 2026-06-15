import { AlertService } from '@core/alert/alert.service';

export function flattenApiErrors(data: Record<string, unknown>): string[] {
  const messages: string[] = [];

  for (const property of Object.keys(data)) {
    const value = data[property];
    if (Array.isArray(value)) {
      messages.push(...value.map(String));
    } else if (value != null) {
      messages.push(String(value));
    }
  }

  return messages;
}

export function getApiErrorMessages(error: unknown): string[] {
  const body = (error as { error?: Record<string, unknown> })?.error;
  if (body && typeof body === 'object') {
    return flattenApiErrors(body);
  }

  return ['Something went wrong. Please try again.'];
}

export function reportApiError(alert: AlertService, error: unknown): void {
  alert.setMessage({ value: getApiErrorMessages(error), type: 'error' });
}
