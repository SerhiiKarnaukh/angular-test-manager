import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import {
  passwordsMatchValidator,
  signupEmailValidators,
  signupNameValidators,
  signupPasswordValidators,
  signupUsernameValidators,
} from '@shared/validators/auth.validators';

export interface AuthSignupFormValue {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth-signup-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './auth-signup-form.component.html',
  styleUrl: './auth-signup-form.component.scss',
})
export class AuthSignupFormComponent {
  readonly namePrefix = input.required<string>();
  readonly loginPath = input.required<string>();
  readonly submitted = output<AuthSignupFormValue>();

  private readonly alert = inject(AlertService);
  private readonly fb = new FormBuilder();

  protected showPassword = false;

  readonly form = this.fb.nonNullable.group({
    username: ['', signupUsernameValidators],
    first_name: ['', signupNameValidators],
    last_name: ['', signupNameValidators],
    email: ['', signupEmailValidators],
    password: ['', signupPasswordValidators],
    password2: ['', [...signupPasswordValidators, passwordsMatchValidator()]],
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    if (value.password !== value.password2) {
      this.alert.setMessage({
        value: ["The passwords doesn't match"],
        type: 'error',
      });
      return;
    }

    this.submitted.emit({
      username: value.username,
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      password: value.password,
    });
  }

  protected fieldError(
    field: 'username' | 'first_name' | 'last_name' | 'email' | 'password' | 'password2',
  ): string | null {
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
    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
    }
    if (control.errors['passwordsMismatch']) {
      return 'Passwords must match';
    }

    return 'Invalid value';
  }
}
