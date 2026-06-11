export function getLoginRoute(path: string): string {
  if (path.startsWith('/taberna')) {
    return `/taberna/login?redirect=${encodeURIComponent(path)}&message=auth`;
  }

  if (path.startsWith('/social')) {
    return '/social/login?message=auth';
  }

  return '/';
}
