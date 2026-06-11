import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-layout-shell',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './layout-shell.component.html',
  styleUrl: './layout-shell.component.scss',
})
export class LayoutShellComponent {
  readonly appName = input.required<string>();

  protected readonly theme = inject(ThemeService);
}
