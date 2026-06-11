import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'theme-preference';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.applyTheme(this.resolveInitialDark(saved));
  }

  private resolveInitialDark(saved: string | null): boolean {
    if (saved === 'dark') {
      return true;
    }
    if (saved === 'light') {
      return false;
    }
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  toggle(): void {
    this.applyTheme(!this.isDark());
  }

  private applyTheme(dark: boolean): void {
    this.isDark.set(dark);
    document.body.classList.toggle('dark-mode', dark);
    document.body.style.colorScheme = dark ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
