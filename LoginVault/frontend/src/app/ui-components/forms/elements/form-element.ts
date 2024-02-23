import { Component, Input } from '@angular/core';
import { FormControl } from "@angular/forms";

@Component({template: ""})
export class FormElement<T> {

  @Input()
  labelName = "";

  @Input()
  form!: FormControl<T>;

  @Input()
  errors = {}

  get elementId(): string {
    return `${this.labelName.toLowerCase()}Element`
  }
}
