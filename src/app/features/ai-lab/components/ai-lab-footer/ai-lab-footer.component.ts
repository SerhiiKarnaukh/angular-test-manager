import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { environment } from '@env/environment';

@Component({
  selector: 'app-ai-lab-footer',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './ai-lab-footer.component.html',
  styleUrl: './ai-lab-footer.component.scss',
})
export class AiLabFooterComponent {
  protected readonly remoteHost = environment.remoteHost;
  protected readonly year = new Date().getFullYear();
}
