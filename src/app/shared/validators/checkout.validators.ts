import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const nameFieldValidators = [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(50),
];

export const checkoutFirstNameValidators = nameFieldValidators;
export const checkoutLastNameValidators = nameFieldValidators;

export const checkoutEmailValidators = [
  Validators.required,
  Validators.email,
  Validators.maxLength(100),
];

export const checkoutPhoneValidators = [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(10),
];

export const checkoutAddressLineValidators = [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(50),
];

export const checkoutOptionalAddressLineValidators = [
  optionalMinLength(3),
  Validators.maxLength(50),
];

export const checkoutCityValidators = nameFieldValidators;
export const checkoutStateValidators = nameFieldValidators;
export const checkoutCountryValidators = nameFieldValidators;

function optionalMinLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return null;
    }

    return value.length >= min
      ? null
      : { minlength: { requiredLength: min, actualLength: value.length } };
  };
}
