import { getLoginRoute } from './get-login-route';

describe('getLoginRoute', () => {
  it('builds taberna login redirect with encoded path', () => {
    expect(getLoginRoute('/taberna/dashboard')).toBe(
      '/taberna/login?redirect=%2Ftaberna%2Fdashboard&message=auth',
    );
  });

  it('builds social login redirect without redirect param', () => {
    expect(getLoginRoute('/social/chat')).toBe('/social/login?message=auth');
  });

  it('falls back to home for other apps', () => {
    expect(getLoginRoute('/ai-lab')).toBe('/');
  });
});
