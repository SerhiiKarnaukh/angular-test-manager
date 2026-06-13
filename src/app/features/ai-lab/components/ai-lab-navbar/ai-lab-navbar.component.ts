import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';

import { environment } from '@env/environment';
import { ThemeService } from '@shared/services/theme.service';

interface AiLabNavItem {
  title: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-ai-lab-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './ai-lab-navbar.component.html',
  styleUrl: './ai-lab-navbar.component.scss',
})
export class AiLabNavbarComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly theme = inject(ThemeService);
  protected readonly remoteHost = environment.remoteHost;
  protected readonly mobileMenuOpen = signal(false);

  protected readonly aiServices: AiLabNavItem[] = [
    { title: 'Funny Chat', icon: 'chat', route: '/ai-lab', exact: true },
    { title: 'Image Generator', icon: 'image', route: '/ai-lab/image-generator' },
    { title: 'Voice Generator', icon: 'record_voice_over', route: '/ai-lab/voice-generator' },
    { title: 'Realtime Chat', icon: 'forum', route: '/ai-lab/realtime-chat' },
  ];

  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
