import { Component, inject } from '@angular/core';
import { ImageService } from "../../shared/services/image.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map } from "rxjs";
import { environment } from "../../../environments/environment";
import { FormControl } from "@angular/forms";
import { FileSizeValidator } from "../../shared/validators/file-size.validator";
import { ErrorToastService } from "../../shared/services/error-toast.service";
import { DEFAULT_IMAGE_KEY } from "../../shared/models/constants";

@Component({
  selector: 'app-image-select-modal',
  templateUrl: './image-select-modal.component.html',
  styleUrls: ['./image-select-modal.component.scss', '../../../assets/scss/modals.scss']
})
export class ImageSelectModalComponent {

  imageService = inject(ImageService);

  errorToastService = inject(ErrorToastService);

  activeModal = inject(NgbActiveModal);

  fileSizeValidator = inject(FileSizeValidator);

  isDeleting = false;

  imageForm = new FormControl<File | null>(null, {
    validators: this.fileSizeValidator.validate
  });

  imageKeys$ = this.imageService.imageKeys.pipe(
    map(keys => keys.length === 0 ? null : keys)
  );

  onImageSelected(imageKey: string) {
    if (this.isDeleting) {
      this.imageService.deleteImage(imageKey).subscribe({
        error: this.errorToastService.showToastFn("Beim Löschen des Bildes ist ein Fehler aufgetreten")
      });
    } else {
      this.activeModal.close(imageKey);
    }
  }

  onFileSelected(fileInput: HTMLInputElement) {
    const file = fileInput.files![0];
    this.imageForm.setValue(file);

    if (file && this.imageForm.valid) {
      this.imageService.uploadImage(fileInput.files![0]).subscribe({
        error: this.errorToastService.showToastFn(
          "Erneut versuchen oder ein anderes Bild wählen",
          "Fehler beim Bildupload")
      });
      fileInput.value = "";
    }
  }

  protected readonly environment = environment;
  protected readonly DEFAULT_KEY = DEFAULT_IMAGE_KEY;
}
