import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';
import { SelectedPostImage } from '@features/social/posts/data-access/social-post.models';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

@Component({
  selector: 'app-create-post-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  templateUrl: './create-post-form.component.html',
  styleUrl: './create-post-form.component.scss',
})
export class CreatePostFormComponent {
  private readonly store = inject(SocialPostsStore);

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly postImages = this.store.postImages;
  protected readonly isSubmitting = signal(false);

  protected readonly form = new FormGroup({
    body: new FormControl('', { nonNullable: true }),
    isPrivate: new FormControl(false, { nonNullable: true }),
  });

  protected openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  protected onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) {
      return;
    }

    const images = this.buildSelectedImages(files);
    this.store.setPostImages(images);
    input.value = '';
  }

  protected async submitForm(): Promise<void> {
    const body = this.form.controls.body.value.trim();
    const hasImages = this.postImages().length > 0;

    if (!body && !hasImages) {
      return;
    }

    const formData = new FormData();
    formData.append('body', body);
    formData.append('is_private', String(this.form.controls.isPrivate.value));

    this.isSubmitting.set(true);
    await this.store.submitPost(formData);
    this.isSubmitting.set(false);
    this.resetForm();
  }

  private buildSelectedImages(files: FileList): SelectedPostImage[] {
    return Array.from(files)
      .filter((file) => ALLOWED_IMAGE_TYPES.includes(file.type))
      .map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
  }

  private resetForm(): void {
    this.form.reset({ body: '', isPrivate: false });
    this.store.setPostImages([]);
  }
}
