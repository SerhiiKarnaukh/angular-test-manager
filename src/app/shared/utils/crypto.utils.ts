import CryptoJS from 'crypto-js';

import { environment } from '@env/environment';

export function encryptData(data: unknown): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), environment.encryptionKey).toString();
}

export function decryptData<T>(encryptedData: string): T {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, environment.encryptionKey);
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)) as T;
}
