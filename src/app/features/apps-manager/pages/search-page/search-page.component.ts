import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppsManagerStore } from '@features/apps-manager/data-access/apps-manager.store';
import { AppsGridComponent } from '@features/apps-manager/components/apps-grid/apps-grid.component';

@Component({
  selector: 'app-search-page',
  imports: [AppsGridComponent, MatProgressBarModule],
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
