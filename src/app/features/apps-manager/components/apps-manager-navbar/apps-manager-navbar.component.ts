import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

import { environment } from '@env/environment';
import { ThemeService } from '@shared/services/theme.service';

import { AppsManagerSearchDialogComponent } from '../apps-manager-search-dialog/apps-manager-search-dialog.component';

@Component({
  selector: 'app-apps-manager-navbar',
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './apps-manager-navbar.component.html',
  styleUrl: './apps-manager-navbar.component.scss',
})
export class AppsManagerNavbarComponent {
  private readonly dialog = inject(MatDialog);
  protected readonly theme = inject(ThemeService);

  protected readonly remoteHost = environment.remoteHost;

  protected openSearchDialog(): void {
    this.dialog.open(AppsManagerSearchDialogComponent, { width: '400px' });
  }
}
