import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppsManagerStore } from '@features/apps-manager/data-access/apps-manager.store';
import { AppsGridComponent } from '@features/apps-manager/components/apps-grid/apps-grid.component';

@Component({
  selector: 'app-home-page',
  imports: [AppsGridComponent, MatProgressBarModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly store = inject(AppsManagerStore);
  private readonly title = inject(Title);

  protected readonly apps = this.store.apps;
  protected readonly isLoading = this.store.isLoading;

  ngOnInit(): void {
    this.title.setTitle('Home | Angular Applications Manager');
    void this.store.loadApps();
  }
}
