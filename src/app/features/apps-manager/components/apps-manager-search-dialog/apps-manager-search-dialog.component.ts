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
  template: `
    <h2 mat-dialog-title>Search</h2>

    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input matInput formControlName="query" name="query" />
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="submit()">Search</button>
    </mat-dialog-actions>
  `,
})
export class AppsManagerSearchDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AppsManagerSearchDialogComponent>);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    query: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const query = this.form.controls.query.value;
    this.dialogRef.close();
    void this.router.navigate(['/apps_manager/search'], { queryParams: { query } });
  }

  close(): void {
    this.dialogRef.close();
  }
}
