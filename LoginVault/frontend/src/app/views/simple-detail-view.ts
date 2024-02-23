import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { combineLatestWith, debounceTime, map, Observable, tap } from "rxjs";
import { DataService } from "../shared/services/data.service";
import { LoginVaultEntity } from "../shared/models/login-vault-entity";
import { Operation, SubmitEvent } from "../shared/models/operation";
import { ErrorToastService } from "../shared/services/error-toast.service";

@Component({template: ''})
export abstract class SimpleDetailView<T extends LoginVaultEntity> {

  abstract service: DataService<T>;

  route = inject(ActivatedRoute);

  errorToastService = inject(ErrorToastService);

  isViewMode$ = this.route.url.pipe(
    map(segments => segments.filter(seg => /(new)|(edit)/.test(seg.path)).length == 0)
  );

  @Output()
  closeEvent = new EventEmitter<string>();

  protected abstract get emptyEntity(): T;

  protected getSelectedEntity(obs: Observable<T[]>) {
    return obs.pipe(
      debounceTime(100),
      combineLatestWith(this.route.params),
      map(([entities, params]) => {
        if (params.hasOwnProperty("id"))
          return entities.find(entity => entity.id === +params["id"])!;
        return this.emptyEntity;
      }),
      tap(entity => {
        // Side effect: If no valid Entity is passed here
        //              (parse-error with NaN or ID not present),
        //              then close the component.
        if (!entity) this.close()
      })
    );
  }

  onSubmit([op, entity]: SubmitEvent<T>) {
    let obs: Observable<T | void> | undefined;
    switch (op) {
      case Operation.DELETE: obs = this.service.delete(entity.id); break;
      case Operation.CREATE: obs = this.service.create(entity); break;
      case Operation.UPDATE: obs = this.service.update(entity); break;
      default: throw new Error(`Unsupported submit operation: \'${op}\'`);
    }
    obs?.subscribe({
      next: () => this.close(),
      error: this.errorToastService.showToastFn("Fehler beim Senden der Anfrage")
    });
  }

  close() {
    this.closeEvent.emit("closed");
  }

}
