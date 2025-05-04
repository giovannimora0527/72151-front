// src/app/utils/date.validators.ts

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minDateValidator(minDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const controlDate = new Date(String(control.value));
    const minComparisonDate = new Date(minDate);

    if (isNaN(controlDate.getTime()) || isNaN(minComparisonDate.getTime())) {
        return { 'minDate': { 'invalidDate': true } };
    }

    const controlDateString = controlDate.toISOString().split('T')[0];
    const minDateString = minComparisonDate.toISOString().split('T')[0];

    if (controlDateString < minDateString) {
      return { minDate: { 'minDateValue': minDate, 'actualValue': control.value } };
    }

    return null;
  };
}