import { describe, expect, it, beforeEach } from 'vitest';

import { encryptData, decryptData } from '@shared/utils/crypto.utils';

import {
  clearSocialUserStorage,
  persistSocialUser,
  restoreSocialUser,
} from './social-profile.persistence';

describe('social profile persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists and restores social user fields', () => {
    localStorage.setItem('access', 'token');

    persistSocialUser({
      id: 1,
      username: 'john',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      slug: 'john',
      full_name: 'John Doe',
      avatar_url: null,
    });

    const restored = restoreSocialUser();
    expect(restored?.slug).toBe('john');
    expect(restored?.email).toBe('john@example.com');
  });

  it('clears encrypted user storage', () => {
    localStorage.setItem('access', 'token');
    persistSocialUser({
      id: 1,
      username: 'john',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      slug: 'john',
      full_name: 'John Doe',
      avatar_url: null,
    });

    clearSocialUserStorage();
    expect(restoreSocialUser()).toBeNull();
  });

  it('encrypts known values consistently through crypto utils', () => {
    const encrypted = encryptData('secret-value');
    expect(decryptData<string>(encrypted)).toBe('secret-value');
  });
});
