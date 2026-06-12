import { Component, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import {
  loginEmailValidators,
  loginPasswordValidators,
} from '@shared/validators/auth.validators';

export interface AuthLoginFormValue {
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth-login-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './auth-login-form.component.html',
  styleUrl: './auth-login-form.component.scss',
})
export class AuthLoginFormComponent {
  readonly namePrefix = input.required<string>();
  readonly signupPath = input.required<string>();
  readonly submitted = output<AuthLoginFormValue>();

  protected showPassword = false;

  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    email: ['', loginEmailValidators],
    password: ['', loginPasswordValidators],
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  protected fieldError(field: 'email' | 'password'): string | null {
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return 'Value is required';
    }
    if (control.errors['email']) {
      return 'Value must be a valid email';
    }
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    }

    return 'Invalid value';
  }
}
