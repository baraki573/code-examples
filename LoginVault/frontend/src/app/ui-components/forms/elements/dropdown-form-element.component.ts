import { Component, Input } from '@angular/core';
import { FormElement } from "./form-element";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs";

@Component({
  selector: 'app-dropdown-form-element',
  templateUrl: './dropdown-form-element.component.html',
  styleUrls: ['./dropdown-form-element.component.scss']
})
export class DropdownFormElementComponent extends FormElement<string> {

  @Input()
  items!: string[];

  searchForm = new FormControl<string>('', {nonNullable: true});

  filteredItems$ = this.searchForm.valueChanges.pipe(
    startWith(''),
    map(value => this.items.filter(item => item.includes(value))),
    map(items => items.length > 0 ? items : null)
  );

  onOpenChange(value: boolean) {
    if(!value && this.form.untouched)
      this.form.markAsTouched()
  }
}
