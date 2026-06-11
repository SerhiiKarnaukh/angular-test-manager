import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthService, provideRouter([])],
    });

    router = TestBed.inject(Router);
  });

  it('allows access when route is public', () => {
    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/taberna/cart' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(true);
  });

  it('redirects taberna protected routes to login', () => {
    const route = { data: { authJWT: true } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/taberna/cart/checkout' } as unknown as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toEqual(
      router.parseUrl('/taberna/login?redirect=%2Ftaberna%2Fcart%2Fcheckout&message=auth'),
    );
  });

  it('redirects social protected routes to login', () => {
    const route = { data: { authJWT: true } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/social/chat' } as unknown as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toEqual(router.parseUrl('/social/login?message=auth'));
  });

  it('allows authenticated users', () => {
    localStorage.setItem('access', 'token');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, provideRouter([])],
    });

    const route = { data: { authJWT: true } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/social/chat' } as unknown as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(true);
  });
});
