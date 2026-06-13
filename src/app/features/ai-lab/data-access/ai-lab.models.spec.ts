import { HttpErrorResponse } from '@angular/common/http';

import {
  extractFilenameFromUrl,
  isOpenAiQuotaExceeded,
  OPENAI_QUOTA_EXCEEDED_CODE,
  parseRealtimeAssistantMessage,
  resolveAiLabApiErrorMessage,
} from './ai-lab.models';

describe('resolveAiLabApiErrorMessage', () => {
  it('returns quota message as-is for HTTP 402', () => {
    const error = new HttpErrorResponse({
      status: 402,
      statusText: 'Payment Required',
      error: {
        message: 'OpenAI API credits have been exhausted.',
        error_code: OPENAI_QUOTA_EXCEEDED_CODE,
      },
    });

    expect(resolveAiLabApiErrorMessage(error)).toBe('OpenAI API credits have been exhausted.');
  });

  it('returns quota message as-is when error_code is openai_quota_exceeded', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: {
        message: 'OpenAI API credits have been exhausted.',
        error_code: OPENAI_QUOTA_EXCEEDED_CODE,
      },
    });

    expect(resolveAiLabApiErrorMessage(error)).toBe('OpenAI API credits have been exhausted.');
  });

  it('appends admin contact suffix for regular API errors', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: 'Error: upstream failed' },
    });

    expect(resolveAiLabApiErrorMessage(error)).toBe(
      'Error: upstream failed Please contact the site administrator if the issue persists.',
    );
  });

  it('returns null when response has no message', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: {},
    });

    expect(resolveAiLabApiErrorMessage(error)).toBeNull();
  });
});

describe('isOpenAiQuotaExceeded', () => {
  it('detects quota by status or error code', () => {
    expect(isOpenAiQuotaExceeded(402, undefined)).toBe(true);
    expect(isOpenAiQuotaExceeded(500, OPENAI_QUOTA_EXCEEDED_CODE)).toBe(true);
    expect(isOpenAiQuotaExceeded(500, undefined)).toBe(false);
  });
});

describe('parseRealtimeAssistantMessage', () => {
  it('returns null for non response.done events', () => {
    expect(parseRealtimeAssistantMessage({ type: 'session.created' })).toBeNull();
  });

  it('returns transcript from response.done payload', () => {
    expect(
      parseRealtimeAssistantMessage({
        type: 'response.done',
        response: { output: [{ content: [{ transcript: 'hello back' }] }] },
      }),
    ).toBe('hello back');
  });

  it('returns text fallback from response.done payload', () => {
    expect(
      parseRealtimeAssistantMessage({
        type: 'response.done',
        response: { output: [{ content: [{ text: 'text reply' }] }] },
      }),
    ).toBe('text reply');
  });
});

describe('extractFilenameFromUrl', () => {
  it('extracts and decodes filename from url path', () => {
    expect(extractFilenameFromUrl('https://cdn.test/uploads/cat%20pic.png')).toBe('cat pic.png');
  });

  it('returns empty string when url has no path segment', () => {
    expect(extractFilenameFromUrl('https://cdn.test/')).toBe('');
  });
});
