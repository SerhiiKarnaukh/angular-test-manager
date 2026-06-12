import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-page-shell',
  template: `<div class="auth-page"><ng-content /></div>`,
  styles: `
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
      width: 100%;
    }

    .auth-page {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 24px clamp(16px, 3vw, 48px);
      box-sizing: border-box;
    }
  `,
})
export class AuthPageShellComponent {}
