import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

import { environment } from '@env/environment';

@Component({
  selector: 'app-apps-manager-footer',
  imports: [MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './apps-manager-footer.component.html',
})
export class AppsManagerFooterComponent {
  protected readonly remoteHost = environment.remoteHost;
  protected readonly year = new Date().getFullYear();
}
