import { AbstractControl, ValidationErrors, Validator } from "@angular/forms";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TrimmedRequiredValidator implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== "string")
      return null;
    return value.trim().length == 0 ? {trimmedRequired: true} : null;
  }

}
