import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { fromEvent } from 'rxjs';

const PARALLAX_FACTOR = 0.45;

@Component({
  selector: 'app-ai-lab-page-layout',
  imports: [MatIconModule],
  templateUrl: './ai-lab-page-layout.component.html',
  styleUrl: './ai-lab-page-layout.component.scss',
})
export class AiLabPageLayoutComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  private readonly pageContent = viewChild<ElementRef<HTMLElement>>('pageContent');

  readonly title = input.required<string>();
  readonly heroImage = input.required<string>();

  protected readonly parallaxOffset = signal(0);
  protected readonly showScrollHint = signal(true);

  ngOnInit(): void {
    this.initParallax();
  }

  protected scrollToContent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.pageContent()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private initParallax(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    fromEvent(window, 'scroll', { passive: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateParallax();
        this.updateScrollHint();
      });

    this.updateParallax();
    this.updateScrollHint();
  }

  private updateParallax(): void {
    if (this.prefersReducedMotion()) {
      return;
    }

    const hero = this.getHeroElement();
    if (!hero) {
      return;
    }

    const scrollY = window.scrollY;
    const maxOffset = hero.offsetHeight * 0.35;
    this.parallaxOffset.set(Math.min(scrollY * PARALLAX_FACTOR, maxOffset));
  }

  private updateScrollHint(): void {
    const hero = this.getHeroElement();
    if (!hero) {
      return;
    }

    this.showScrollHint.set(window.scrollY < hero.offsetHeight * 0.35);
  }

  private getHeroElement(): HTMLElement | null {
    return this.elementRef.nativeElement.querySelector('.hero-banner') as HTMLElement | null;
  }

  private prefersReducedMotion(): boolean {
    if (typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
