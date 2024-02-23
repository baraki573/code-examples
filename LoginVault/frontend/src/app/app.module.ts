import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainLayoutComponent } from './ui-components/layouts/main-layout.component';
import { TopNavigationComponent } from './ui-components/top-navigation.component';
import { SideNavigationComponent } from './ui-components/side-navigation.component';
import { NavButtonComponent } from './ui-components/nav-button.component';
import { LoginsViewComponent } from './views/logins-view.component';
import { CategoriesViewComponent } from './views/categories-view.component';
import { CategoryService } from "./shared/services/category.service";
import { HttpClientModule } from "@angular/common/http";
import { ContentLayoutComponent } from './ui-components/layouts/content-layout.component';
import { LoginService } from "./shared/services/login.service";
import { ImageButtonComponent } from './ui-components/image-button.component';
import { LoginDetailViewComponent } from './views/login-detail-view.component';
import { ShortUrlPipe } from './shared/pipes/shorturl.pipe';
import { LoginDescriptionComponent } from './ui-components/descriptions/login-description.component';
import { CategoryDescriptionComponent } from './ui-components/descriptions/category-description.component';
import { EntityListComponent } from './ui-components/entity-list.component';
import { CategoryDetailViewComponent } from "./views/category-detail-view.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CategoryFormComponent } from './ui-components/forms/category-form.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginFormComponent } from './ui-components/forms/login-form.component';
import { DropdownFormElementComponent } from './ui-components/forms/elements/dropdown-form-element.component';
import { LabeledTextFormElementComponent } from './ui-components/forms/elements/labeled-text-form-element.component';
import { FormElement } from './ui-components/forms/elements/form-element';
import { LoginDeleteModalComponent } from "./ui-components/modals/login-delete-modal.component";
import { initializeKeycloak } from "./keycloak-init.factory";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { LogoutModalComponent } from './ui-components/modals/logout-modal.component';
import { ImageViewComponent } from './ui-components/image-view.component';
import { ImageSelectModalComponent } from './ui-components/modals/image-select-modal.component';
import { ToastrModule } from "ngx-toastr";

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    TopNavigationComponent,
    SideNavigationComponent,
    NavButtonComponent,
    LoginsViewComponent,
    CategoriesViewComponent,
    ContentLayoutComponent,
    ImageButtonComponent,
    LoginDetailViewComponent,
    ShortUrlPipe,
    CategoryDetailViewComponent,
    LoginDescriptionComponent,
    CategoryDescriptionComponent,
    EntityListComponent,
    CategoryFormComponent,
    LoginFormComponent,
    DropdownFormElementComponent,
    LabeledTextFormElementComponent,
    FormElement,
    LoginDeleteModalComponent,
    LogoutModalComponent,
    ImageViewComponent,
    ImageSelectModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    ToastrModule.forRoot({
      maxOpened: 5,
      positionClass: "toast-bottom-right",
      toastClass: "ngx-toastr shadow-none"
    })
  ],
  providers: [
    CategoryService,
    LoginService,
    DatePipe, {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
