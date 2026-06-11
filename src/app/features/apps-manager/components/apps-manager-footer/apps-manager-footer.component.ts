import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { environment } from '@env/environment';

@Component({
  selector: 'app-apps-manager-footer',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './apps-manager-footer.component.html',
  styleUrl: './apps-manager-footer.component.scss',
})
export class AppsManagerFooterComponent {
  protected readonly remoteHost = environment.remoteHost;
  protected readonly year = new Date().getFullYear();
}
