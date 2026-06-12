import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AuthPageShellComponent } from '@shared/ui/auth-page-shell/auth-page-shell.component';

@Component({
  selector: 'app-not-found-page',
  imports: [
    AuthPageShellComponent,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <app-auth-page-shell>
      <mat-card class="status-card">
        <mat-card-content>
          <p class="status-code">404</p>
          <h2 class="status-title">Page not found</h2>
          <p class="status-message">
            The page you are looking for does not exist or has been moved.
          </p>
          <div class="card-actions">
            <a mat-flat-button color="primary" routerLink="/">
              <mat-icon>home</mat-icon>
              Back to home
            </a>
          </div>
        </mat-card-content>
      </mat-card>
    </app-auth-page-shell>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
      width: 100%;
    }

    .status-card {
      width: 100%;
      max-width: 420px;
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 32px 24px 24px;
    }

    .status-code {
      margin: 0 0 8px;
      font-size: 2.5rem;
      font-weight: 300;
      line-height: 1;
      opacity: 0.7;
    }

    .status-title {
      margin: 0 0 12px;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.3;
    }

    .status-message {
      margin: 0;
      line-height: 1.5;
      max-width: 28rem;
    }

    .card-actions {
      display: flex;
      justify-content: center;
      padding-top: 24px;
    }

    .card-actions a mat-icon {
      margin-right: 4px;
    }
  `,
})
export class NotFoundPageComponent implements OnInit {
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Page not found | Angular Apps Manager');
  }
}
