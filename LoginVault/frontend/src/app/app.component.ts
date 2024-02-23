import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from "./shared/services/category.service";
import { LoginService } from "./shared/services/login.service";
import { KeycloakService } from "keycloak-angular";
import { ImageService } from "./shared/services/image.service";
import { ErrorToastService } from "./shared/services/error-toast.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  errorToastService = inject(ErrorToastService);

  categoryService = inject(CategoryService);

  loginService = inject(LoginService);

  imageService = inject(ImageService);

  keycloakService = inject(KeycloakService);

  title = 'LoginVault';

  ngOnInit() {
    if (this.keycloakService.getKeycloakInstance().profile) {
      this.categoryService.initObservable.subscribe({
        error: this.errorToastService.showToastFn("Die gespeicherten Kategorien konnten nicht abgerufen werden")
      });
      this.loginService.initObservable.subscribe({
        error: this.errorToastService.showToastFn("Die gespeicherten Logins konnten nicht abgerufen werden")
      });
      this.imageService.initObservable.subscribe({
        error: this.errorToastService.showToastFn("Die verfügbaren Bilder konnten nicht abgerufen werden")
      });
    }
  }
}
