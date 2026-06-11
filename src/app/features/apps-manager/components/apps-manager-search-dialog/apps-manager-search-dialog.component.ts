import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apps-manager-search-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './apps-manager-search-dialog.component.html',
  styleUrl: './apps-manager-search-dialog.component.scss',
})
export class AppsManagerSearchDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AppsManagerSearchDialogComponent>);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    query: ['', Validators.required],
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const query = this.form.controls.query.value.trim();
    if (!query) {
      return;
    }

    this.dialogRef.close();
    void this.router.navigate(['/apps_manager/search'], { queryParams: { query } });
  }

  close(): void {
    this.dialogRef.close();
  }
}
