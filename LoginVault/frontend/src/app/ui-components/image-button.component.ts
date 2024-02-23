import { Component, Input } from '@angular/core';
import { Params } from "@angular/router";
import { selectedBorderAnimation } from "../shared/animations";

@Component({
  selector: 'app-image-button',
  templateUrl: './image-button.component.html',
  styleUrls: ['./image-button.component.scss'],
  animations: [selectedBorderAnimation]
})
export class ImageButtonComponent {

  @Input()
  navigateTo = "";

  @Input()
  navigateToEdit = "";

  @Input()
  isSelected: boolean = false;

  @Input()
  params: Params = {};

  @Input()
  imageKey!: string;

  isButtonDisabled(link: string) {
    const creating = this.navigateToEdit === "0/edit";
    return creating || location.pathname.endsWith(`/${link}`);
  }

}
