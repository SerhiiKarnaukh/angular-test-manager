import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ProductsGridComponent } from '@features/taberna/components/products-grid/products-grid.component';
import { TabernaProductStore } from '@features/taberna/data-access/taberna-product.store';
import { CardGridSkeletonComponent } from '@shared/ui/card-grid-skeleton/card-grid-skeleton.component';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-taberna-search-page',
  imports: [ProductsGridComponent, CardGridSkeletonComponent, EmptyStateComponent],
  templateUrl: './taberna-search-page.component.html',
  styleUrl: './taberna-search-page.component.scss',
})
export class TabernaSearchPageComponent implements OnInit {
  private readonly store = inject(TabernaProductStore);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  protected readonly products = this.store.searchResults;
  protected readonly isLoading = this.store.isLoading;
  protected readonly query = this.store.query;

  ngOnInit(): void {
    this.title.setTitle('Search | Taberna');

    const query = this.route.snapshot.queryParamMap.get('query');
    if (query) {
      void this.store.search(query);
    }
  }
}
