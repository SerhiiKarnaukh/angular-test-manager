import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ProductsGridComponent } from '@features/taberna/components/products-grid/products-grid.component';
import { TabernaProductStore } from '@features/taberna/data-access/taberna-product.store';

@Component({
  selector: 'app-taberna-search-page',
  imports: [ProductsGridComponent, MatProgressBarModule],
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
