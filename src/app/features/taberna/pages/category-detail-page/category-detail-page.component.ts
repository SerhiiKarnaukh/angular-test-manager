import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ProductsGridComponent } from '@features/taberna/components/products-grid/products-grid.component';
import { TabernaProductStore } from '@features/taberna/data-access/taberna-product.store';
import { CardGridSkeletonComponent } from '@shared/ui/card-grid-skeleton/card-grid-skeleton.component';

@Component({
  selector: 'app-category-detail-page',
  imports: [ProductsGridComponent, CardGridSkeletonComponent],
  templateUrl: './category-detail-page.component.html',
  styleUrl: './category-detail-page.component.scss',
})
export class CategoryDetailPageComponent implements OnInit {
  private readonly store = inject(TabernaProductStore);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly category = this.store.category;
  protected readonly isLoading = this.store.isLoading;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const categorySlug = params.get('category_slug');
      if (!categorySlug) {
        return;
      }

      void this.loadCategory(categorySlug);
    });
  }

  private async loadCategory(categorySlug: string): Promise<void> {
    await this.store.loadCategory(categorySlug);
    const name = this.store.category()?.name;
    if (name) {
      this.title.setTitle(`${name} | Taberna`);
    }
  }
}
