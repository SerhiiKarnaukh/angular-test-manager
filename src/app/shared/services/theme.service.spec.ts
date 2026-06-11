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
