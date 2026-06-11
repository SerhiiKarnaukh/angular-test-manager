import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { environment } from '@env/environment';
import { TabernaProductStore } from '@features/taberna/data-access/taberna-product.store';
import { ThemeService } from '@shared/services/theme.service';

import { TabernaSearchDialogComponent } from '../taberna-search-dialog/taberna-search-dialog.component';

@Component({
  selector: 'app-taberna-navbar',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './taberna-navbar.component.html',
  styleUrl: './taberna-navbar.component.scss',
})
export class TabernaNavbarComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly store = inject(TabernaProductStore);
  private readonly router = inject(Router);

  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly remoteHost = environment.remoteHost;
  protected readonly categories = this.store.categories;

  /** Cart quantity — wired in Phase 4 */
  protected readonly cartQuantity = 0;

  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  ngOnInit(): void {
    void this.store.loadCategories();
  }

  protected openSearchDialog(): void {
    this.dialog.open(TabernaSearchDialogComponent, {
      width: '400px',
      maxWidth: '95vw',
      panelClass: 'taberna-search-dialog',
      autoFocus: 'first-toggler',
    });
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/taberna/login']);
  }
}
