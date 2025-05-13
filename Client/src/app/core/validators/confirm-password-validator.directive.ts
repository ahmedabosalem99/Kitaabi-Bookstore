// confirm-password.validator.ts
import { Directive, Input, forwardRef, OnChanges } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector: '[appConfirmPassword][ngModel]',
  standalone: true, // ✅ for standalone
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ConfirmPasswordValidatorDirective),
      multi: true,
    },
  ],
})
export class ConfirmPasswordValidatorDirective implements Validator, OnChanges {
  /** value of the password field to compare with */
  @Input() appConfirmPassword = '';

  private _onChange?: () => void;

  ngOnChanges(): void {
    // tell Angular to re-run validation when the @Input changes
    this._onChange?.();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) {
      return null;
    } // form not yet built
    const pass = this.appConfirmPassword;
    const confirm = control.value;
    return pass === confirm ? null : { mismatch: true }; // <-- key line
  }

  registerOnValidatorChange(fn: () => void) {
    this._onChange = fn;
  }
}
