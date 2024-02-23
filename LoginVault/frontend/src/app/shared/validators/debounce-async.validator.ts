import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { debounceTime, first, map, Observable, of, startWith, switchMap } from "rxjs";

export abstract class DebounceAsyncValidator {

  protected abstract validateInput(input: string): Observable<boolean>;

  protected abstract get errorMap(): {};

  validate(initial?: string): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      return control.valueChanges.pipe(
        startWith(control.value),
        debounceTime(400),
        switchMap(c => {
          if (c === initial)
            return of(true);
          return this.validateInput(c.trim())
        }),
        map(validated => validated ? null : this.errorMap),
        first()
      );
    }
  }

}
