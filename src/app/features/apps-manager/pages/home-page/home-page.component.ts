import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';

import { AppsGridComponent } from '@features/apps-manager/components/apps-grid/apps-grid.component';
import { AppsManagerStore } from '@features/apps-manager/data-access/apps-manager.store';
import { CardGridSkeletonComponent } from '@shared/ui/card-grid-skeleton/card-grid-skeleton.component';

const PARALLAX_FACTOR = 0.45;

@Component({
  selector: 'app-home-page',
  imports: [AppsGridComponent, CardGridSkeletonComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly store = inject(AppsManagerStore);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  protected readonly apps = this.store.apps;
  protected readonly isLoading = this.store.isLoading;
  protected readonly parallaxOffset = signal(0);

  ngOnInit(): void {
    this.title.setTitle('Home | Angular Applications Manager');
    void this.store.loadApps();
    this.initParallax();
  }

  private initParallax(): void {
    if (!isPlatformBrowser(this.platformId) || this.prefersReducedMotion()) {
      return;
    }

    fromEvent(window, 'scroll', { passive: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateParallax());

    this.updateParallax();
  }

  private updateParallax(): void {
    const hero = this.elementRef.nativeElement.querySelector('.hero-banner') as HTMLElement | null;
    if (!hero) {
      return;
    }

    const scrollY = window.scrollY;
    const maxOffset = hero.offsetHeight * 0.35;
    this.parallaxOffset.set(Math.min(scrollY * PARALLAX_FACTOR, maxOffset));
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
