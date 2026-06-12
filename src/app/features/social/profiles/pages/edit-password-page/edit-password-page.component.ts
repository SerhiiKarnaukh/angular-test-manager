import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AlertService } from '@core/alert/alert.service';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';

@Component({
  selector: 'app-edit-password-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './edit-password-page.component.html',
  styleUrl: './edit-password-page.component.scss',
})
export class EditPasswordPageComponent {
  private readonly profileStore = inject(SocialProfileStore);
  private readonly alert = inject(AlertService);

  protected readonly showPassword = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly form = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    password1: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    password2: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  protected async submitForm(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, password1, password2 } = this.form.getRawValue();
    if (password1 !== password2) {
      this.alert.setMessage({ value: ['The password does not match'], type: 'error' });
      return;
    }

    this.isSubmitting.set(true);
    await this.profileStore.editPassword({
      old_password: password,
      new_password1: password1,
      new_password2: password2,
    });
    this.isSubmitting.set(false);
  }
}
