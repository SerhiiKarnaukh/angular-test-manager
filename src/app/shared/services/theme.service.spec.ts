import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark-mode');
    document.body.style.colorScheme = '';

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should default to light mode on first visit', () => {
    expect(service.isDark()).toBe(false);
    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('theme-preference')).toBe('light');
  });

  it('should restore saved dark preference', () => {
    localStorage.setItem('theme-preference', 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(ThemeService);

    expect(restored.isDark()).toBe(true);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });

  it('should toggle dark mode', () => {
    const initial = service.isDark();
    service.toggle();
    expect(service.isDark()).toBe(!initial);
    expect(document.body.classList.contains('dark-mode')).toBe(!initial);
  });

  it('should persist theme preference', () => {
    service.toggle();
    expect(localStorage.getItem('theme-preference')).toBeTruthy();
  });
});
