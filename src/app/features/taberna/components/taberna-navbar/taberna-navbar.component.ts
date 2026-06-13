import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { environment } from '@env/environment';
import { TabernaCartStore } from '@features/taberna/cart/data-access/taberna-cart.store';
import { TabernaProductStore } from '@features/taberna/data-access/taberna-product.store';
import { ThemeService } from '@shared/services/theme.service';

import { TabernaSearchDialogComponent } from '../taberna-search-dialog/taberna-search-dialog.component';

@Component({
  selector: 'app-taberna-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
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
  private readonly productStore = inject(TabernaProductStore);
  private readonly cartStore = inject(TabernaCartStore);
  private readonly router = inject(Router);

  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly remoteHost = environment.remoteHost;
  protected readonly categories = this.productStore.categories;
  protected readonly cartQuantity = this.cartStore.cartQuantity;

  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  ngOnInit(): void {
    void this.productStore.loadCategories();
  }

  protected openSearchDialog(): void {
    this.dialog.open(TabernaSearchDialogComponent, {
      width: '400px',
      maxWidth: '95vw',
      panelClass: 'taberna-search-dialog',
      autoFocus: 'first-toggler',
    });
  }

  protected async logout(): Promise<void> {
    this.auth.logout();
    await this.cartStore.loadCart();
    await this.router.navigate(['/taberna/login']);
  }
}
