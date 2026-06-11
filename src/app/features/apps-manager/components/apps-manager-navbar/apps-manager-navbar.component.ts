import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { environment } from '@env/environment';
import { ThemeService } from '@shared/services/theme.service';

import { AppsManagerSearchDialogComponent } from '../apps-manager-search-dialog/apps-manager-search-dialog.component';

@Component({
  selector: 'app-apps-manager-navbar',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './apps-manager-navbar.component.html',
  styleUrl: './apps-manager-navbar.component.scss',
})
export class AppsManagerNavbarComponent {
  private readonly dialog = inject(MatDialog);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly theme = inject(ThemeService);
  protected readonly remoteHost = environment.remoteHost;

  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  protected readonly mobileMenuOpen = signal(false);

  protected openSearchDialog(): void {
    this.dialog.open(AppsManagerSearchDialogComponent, { width: '400px' });
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
