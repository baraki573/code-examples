import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { EditedEntityService } from "../../shared/services/edited-entity.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { TrimmedRequiredValidator } from "../../shared/validators/trimmed-required.validator";
import { LoginVaultEntity } from "../../shared/models/login-vault-entity";
import { Operation, SubmitEvent } from "../../shared/models/operation";
import { ImageSelectModalComponent } from "../modals/image-select-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({template: ''})
export abstract class SimpleForm<T extends LoginVaultEntity> implements OnChanges, OnDestroy {

  editedEntityService = inject(EditedEntityService);

  modalService = inject(NgbModal);

  fb = inject(FormBuilder);

  trimmedRequired = inject(TrimmedRequiredValidator).validate;

  @Input()
  entity!: T;

  @Input()
  close!: () => void;

  @Output()
  submitted = new EventEmitter<SubmitEvent<T>>();

  abstract form: FormControl | FormGroup;

  abstract ngOnChanges(changes: SimpleChanges): void;

  ngOnDestroy() {
    this.editedEntityService.clear();
  }

  onSubmit(): void {
    const op = this.entity.id === 0 ? Operation.CREATE : Operation.UPDATE;

    this.submitted.emit([op, this.entity]);
    this.form.reset();
  };

  abstract get displayedName(): string;

  hasError(control: FormControl, error: string): boolean {
    return (control.touched || control.dirty) && control.hasError(error);
  }

  isInvalid(control: FormControl): boolean {
    return (control.touched || control.dirty) && control.invalid;
  }

  inputChange(): void {
    this.editedEntityService.setEntityName(this.displayedName);
  }

  openImageModal() {
    if (this.form.disabled) return;

    const modalRef = this.modalService.open(ImageSelectModalComponent, {
      centered: true,
      scrollable: true,
      backdropClass: "modal-backdrop"
    });

    modalRef.result?.then((result) => {
        this.form.get('imageKey')?.setValue(result);
      },
      () => {} //Do nothing on modal dismiss
    );
  }

}
