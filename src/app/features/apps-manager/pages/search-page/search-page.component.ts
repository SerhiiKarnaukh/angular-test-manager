import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AppsManagerStore } from '@features/apps-manager/data-access/apps-manager.store';
import { AppsGridComponent } from '@features/apps-manager/components/apps-grid/apps-grid.component';
import { CardGridSkeletonComponent } from '@shared/ui/card-grid-skeleton/card-grid-skeleton.component';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-search-page',
  imports: [AppsGridComponent, CardGridSkeletonComponent, EmptyStateComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit {
  private readonly store = inject(AppsManagerStore);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  protected readonly apps = this.store.apps;
  protected readonly isLoading = this.store.isLoading;
  protected readonly query = this.store.query;

  ngOnInit(): void {
    this.title.setTitle('Search | Angular Applications Manager');

    const query = this.route.snapshot.queryParamMap.get('query');
    if (query) {
      void this.store.search(query);
    }
  }
}
