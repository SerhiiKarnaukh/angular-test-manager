import { environment } from '@env/environment';
import { extractDomain } from '@shared/utils/domain.utils';

export function buildSocialWebSocketUrl(path: string): string {
  const domain = extractDomain(environment.remoteHost);
  const protocol =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';

  return `${protocol}//${domain}${path}`;
}
