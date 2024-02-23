import { BehaviorSubject, Observable, tap } from "rxjs";
import { LoginVaultEntity } from "../models/login-vault-entity";
import { CrudService } from "./crud.service";

export abstract class DataService<T extends LoginVaultEntity> extends CrudService<T> {

  protected elements$ = new BehaviorSubject<T[]>([]);

  get initObservable() {
    return this.findAll();
  }

  override create(toCreate: T): Observable<T> {
    return super.create(toCreate).pipe(
      tap(created => {
        if (created)
          this.elements$.next([created, ...this.elements$.value]);
      })
    );
  }

  override findAll(): Observable<T[]> {
    return super.findAll().pipe(
      tap(elements => {
        if (elements)
          this.elements$.next(elements);
      })
    );
  }

  override update(toUpdate: T): Observable<T> {
    return super.update(toUpdate).pipe(
      tap(updated => {
        if (!updated) return;

        const index = this.elements$.value.findIndex(element => element.id === updated.id);
        if (index !== -1) {
          const nextElements = this.elements$.value;
          nextElements[index] = updated;
          this.elements$.next(nextElements);
        }
      })
    );
  }

  override delete(id: number): Observable<void> {
    return super.delete(id).pipe(
      tap(() => {
        const nextElements = this.elements$.value.filter(element => element.id !== id);
        this.elements$.next(nextElements);
      })
    );
  }
}
