import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  signupEmailValidators,
  signupNameValidators,
  signupUsernameValidators,
} from '@shared/validators/auth.validators';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';

@Component({
  selector: 'app-edit-profile-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.scss',
})
export class EditProfilePageComponent implements OnInit {
  private readonly profileStore = inject(SocialProfileStore);

  protected readonly isSubmitting = signal(false);
  private avatarFile: File | null = null;

  protected readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: signupUsernameValidators }),
    first_name: new FormControl('', { nonNullable: true, validators: signupNameValidators }),
    last_name: new FormControl('', { nonNullable: true, validators: signupNameValidators }),
    email: new FormControl('', { nonNullable: true, validators: signupEmailValidators }),
  });

  ngOnInit(): void {
    const user = this.profileStore.user();
    if (user) {
      this.form.patchValue({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
      return;
    }

    void this.profileStore.loadUserData().then(() => {
      const loadedUser = this.profileStore.user();
      if (loadedUser) {
        this.form.patchValue({
          username: loadedUser.username,
          first_name: loadedUser.first_name,
          last_name: loadedUser.last_name,
          email: loadedUser.email,
        });
      }
    });
  }

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.avatarFile = input.files?.[0] ?? null;
  }

  protected async submitForm(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('username', this.form.controls.username.value);
    formData.append('first_name', this.form.controls.first_name.value);
    formData.append('last_name', this.form.controls.last_name.value);
    formData.append('email', this.form.controls.email.value);

    if (this.avatarFile) {
      formData.append('avatar', this.avatarFile);
    }

    this.isSubmitting.set(true);
    await this.profileStore.editProfile(formData);
    this.isSubmitting.set(false);
  }
}
