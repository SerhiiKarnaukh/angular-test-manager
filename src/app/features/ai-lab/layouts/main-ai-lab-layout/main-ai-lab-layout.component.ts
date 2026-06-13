import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AiLabFooterComponent } from '@features/ai-lab/components/ai-lab-footer/ai-lab-footer.component';
import { AiLabNavbarComponent } from '@features/ai-lab/components/ai-lab-navbar/ai-lab-navbar.component';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

@Component({
  selector: 'app-main-ai-lab-layout',
  imports: [AiLabNavbarComponent, AiLabFooterComponent, RouterOutlet],
  template: `
    <div class="ai-lab-layout">
      <app-ai-lab-navbar />
      <main class="ai-lab-main">
        <router-outlet />
      </main>
      <app-ai-lab-footer />
    </div>
  `,
  styles: `
    .ai-lab-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      --ai-lab-nav-height: 64px;
    }

    .ai-lab-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `,
})
export class MainAiLabLayoutComponent implements OnInit, OnDestroy {
  private readonly store = inject(AiLabStore);

  ngOnInit(): void {
    void this.store.connectRealtimeSocket();
  }

  ngOnDestroy(): void {
    this.store.disconnectRealtimeSocket();
  }
}
