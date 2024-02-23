import { Injectable } from '@angular/core';
import { Login } from "../models/login";
import { Observable } from "rxjs";
import { DataService } from "./data.service";
import { environment } from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class LoginService extends DataService<Login> {

  get baseUrl(): string {
    return `${environment.api_base}/logins`;
  }

  get logins() {
    return this.elements$.asObservable();
  }

  findAllByCategoryName(categoryName: string): Observable<Login[]> {
    const url = `${this.baseUrl}?orderBy=id&categoryName=${categoryName}`

    return this.http.get<Login[]>(url);
  }

}
