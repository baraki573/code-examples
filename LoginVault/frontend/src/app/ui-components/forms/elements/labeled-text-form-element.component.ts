import { Component, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { FormElement } from "./form-element";

@Component({
  selector: 'app-labeled-text-form-element',
  templateUrl: './labeled-text-form-element.component.html',
  styleUrls: ['./labeled-text-form-element.component.scss']
})
export class LabeledTextFormElementComponent extends FormElement<string[]> {

  @Input()
  prefix = "";

  newLabel = new FormControl<string>('', {nonNullable: true});

  addNewLabel() {
    let toAdd = this.newLabel.value.trim();
    toAdd = toAdd.replace(new RegExp(`^(${this.prefix})+\\s*`), "");
    if (toAdd.length > 0 && !this.form.value.includes(toAdd)) {
      this.form.value.push(toAdd);
    }

    this.newLabel.reset();
  }

  remove(element: string) {
    this.form.setValue(this.form.value.filter((n: string) => n !== element));
  }
}
