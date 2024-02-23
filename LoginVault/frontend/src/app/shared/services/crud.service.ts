import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginVaultEntity } from "../models/login-vault-entity";
import { inject } from "@angular/core";

export abstract class CrudService<T extends LoginVaultEntity> {

  protected http = inject(HttpClient);

  abstract get baseUrl(): string;

  create(toCreate: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, toCreate);
  }

  findAll(): Observable<T[]> {
    const uri = `${this.baseUrl}?orderBy=id:DESC`;

    return this.http.get<T[]>(uri);
  }

  getById(id: number): Observable<T> {
    const uri = `${this.baseUrl}/${id}`;

    return this.http.get<T>(uri);
  }

  update(toUpdate: T): Observable<T> {
    const uri = `${this.baseUrl}/${toUpdate.id}`;

    return this.http.put<T>(uri, toUpdate);
  }

  delete(id: number): Observable<void> {
    const uri = `${this.baseUrl}/${id}`;

    return this.http.delete<void>(uri);
  }

}
