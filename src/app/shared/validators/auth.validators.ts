import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const loginEmailValidators = [Validators.required, Validators.email];
export const loginPasswordValidators = [Validators.required, Validators.minLength(6)];

export const signupUsernameValidators = [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(50),
];

export const signupNameValidators = [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(50),
];

export const signupEmailValidators = [
  Validators.required,
  Validators.email,
  Validators.maxLength(100),
];

export const signupPasswordValidators = [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(128),
];

export function passwordsMatchValidator(passwordKey = 'password'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }

    const password = parent.get(passwordKey)?.value;
    return control.value === password ? null : { passwordsMismatch: true };
  };
}
