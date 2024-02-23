import { AbstractControl, ValidationErrors, Validator } from "@angular/forms";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class FileSizeValidator implements Validator {

  validate(control: AbstractControl<File | null>): ValidationErrors | null {
    const fileSize = control.value?.size;
    return fileSize && fileSize > environment.file_limit ? { "imageTooLarge": true } : null;
  }

}
