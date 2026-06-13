import { HttpErrorResponse } from '@angular/common/http';

import {
  isOpenAiQuotaExceeded,
  OPENAI_QUOTA_EXCEEDED_CODE,
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
