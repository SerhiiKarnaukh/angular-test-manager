export function extractDomain(url: string): string {
  if (url.includes('://')) {
    return url.split('/')[2];
  }

  return url.split('/')[0];
}
