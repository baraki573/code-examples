import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Login } from "../../shared/models/login";
import { Category } from "../../shared/models/category";
import { UniqueLoginUrlValidator } from "../../shared/validators/unique-login-url.validator";
import { SimpleForm } from "./simple-form";
import { LoginDeleteModalComponent } from "../modals/login-delete-modal.component";
import { Operation } from "../../shared/models/operation";
import { DEFAULT_IMAGE_KEY } from "../../shared/models/constants";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends SimpleForm<Login> {

  urlValidator = inject(UniqueLoginUrlValidator);

  @Input()
  categories!: Category[];

  get categoryNames() {
    return this.categories.map(c => c.name);
  }

  @Input()
  isViewMode = false;

  form = this.fb.nonNullable.group({
      name: ['', this.trimmedRequired],
      url: ['', this.trimmedRequired, this.urlValidator.validate()],
      description: [''],
      username: ['', this.trimmedRequired],
      password: ['', this.trimmedRequired],
      category: ['', this.trimmedRequired],
      hashtags: [[] as string[]],
      imageKey: [DEFAULT_IMAGE_KEY]
    }
  );

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty("isViewMode")) {
      if (this.isViewMode)
        this.form.disable();
      else
        this.form.enable();
    }

    if (changes.hasOwnProperty("entity")) {
      this.form.controls.url.setAsyncValidators(this.urlValidator.validate(this.entity.url))
      this.form.setValue({
        name: this.entity.name,
        url: this.entity.url,
        description: this.entity.description,
        username: this.entity.username,
        password: this.entity.password,
        category: this.entity.category.name ?? '',
        hashtags: this.entity.hashtags,
        imageKey: this.entity.imageKey
      });
      this.editedEntityService.setEntity({...this.entity, name: this.displayedName});
    }
  }

  override onSubmit() {
    for (const field in this.form.controls) {
      const control = this.form.get(field);
      if (typeof control?.value === 'string')
        control.setValue(control.value.trim());
    }

    const category = this.categories.find(category => category.name === this.form.value['category'])!;
    this.entity = {...this.entity, ...this.form.getRawValue(), category: category};

    super.onSubmit();
  }

  get displayedName() {
    const name = this.form.controls.name.value;
    return name.trim().length === 0 ? "Neues Login" : name;
  }

  openDeleteModal() {
    const modalRef = this.modalService.open(LoginDeleteModalComponent, {
      centered: true,
      scrollable: true,
      backdropClass: "modal-backdrop"
    });
    modalRef.componentInstance.login = this.entity;

    modalRef.result?.then((result) => {
        if (result === Operation.DELETE) {
          this.submitted.emit([Operation.DELETE, this.entity]);
          this.close();
        }
      },
      () => {} //Do nothing on modal dismiss
    );
  }
}
