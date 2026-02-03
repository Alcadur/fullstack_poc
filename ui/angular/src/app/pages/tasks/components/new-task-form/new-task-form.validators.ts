import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export const descriptionOrStepsRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const description = control.get('description')?.value;
  const steps = control.get('steps') as FormArray;

  const hasDescription = description?.trim().length > 0;
  const hasSteps = steps?.length > 0;

  if (!hasDescription && !hasSteps) {
    return { descriptionOrStepsRequired: true };
  }

  return null;
};
