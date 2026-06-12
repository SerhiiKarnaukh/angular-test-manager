import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-social-footer',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './social-footer.component.html',
  styleUrl: './social-footer.component.scss',
})
export class SocialFooterComponent {
  protected readonly auth = inject(AuthService);
  protected readonly remoteHost = environment.remoteHost;
  protected readonly year = new Date().getFullYear();
}
