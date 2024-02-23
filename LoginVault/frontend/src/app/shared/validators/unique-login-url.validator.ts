import { inject, Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { LoginService } from "../services/login.service";
import { DebounceAsyncValidator } from "./debounce-async.validator";

@Injectable({providedIn: 'root'})
export class UniqueLoginUrlValidator extends DebounceAsyncValidator {

  loginService = inject(LoginService);

  protected validateInput(url: string): Observable<boolean> {
    return this.loginService.logins.pipe(
      map(logins => logins.filter(l => l.url === url)),
      map(logins => logins.length === 0),
    );
  }

  protected get errorMap(): {} {
    return {urlTaken: true};
  }

}
