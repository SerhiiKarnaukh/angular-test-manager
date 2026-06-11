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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { fromEvent } from 'rxjs';

import { ProductsGridComponent } from '@features/taberna/components/products-grid/products-grid.component';
import { TabernaProductStore } from '@features/taberna/data-access/taberna-product.store';

const PARALLAX_FACTOR = 0.35;

@Component({
  selector: 'app-product-home-page',
  imports: [ProductsGridComponent, MatProgressBarModule],
  templateUrl: './product-home-page.component.html',
  styleUrl: './product-home-page.component.scss',
})
export class ProductHomePageComponent implements OnInit {
  private readonly store = inject(TabernaProductStore);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  protected readonly products = this.store.latestProducts;
  protected readonly isLoading = this.store.isLoading;
  protected readonly parallaxOffset = signal(0);

  ngOnInit(): void {
    this.title.setTitle('Home | Taberna');
    void this.store.loadLatestProducts();
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

    this.parallaxOffset.set(hero.getBoundingClientRect().top * PARALLAX_FACTOR);
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
