import { Component, inject } from '@angular/core';
import { LoginService } from "../shared/services/login.service";
import { combineLatestWith, map, Observable, tap } from "rxjs";
import { Login } from "../shared/models/login";
import { CategoryService } from "../shared/services/category.service";
import { SimpleDetailView } from "./simple-detail-view";
import { Category } from "../shared/models/category";
import { DEFAULT_IMAGE_KEY } from "../shared/models/constants";
import { Title } from "@angular/platform-browser";

type LoginData = {login: Login, categories: Category[], isViewMode: boolean};

@Component({
  selector: 'app-login-detail-view',
  templateUrl: './login-detail-view.component.html',
  styleUrls: ['./login-detail-view.component.scss']
})
export class LoginDetailViewComponent extends SimpleDetailView<Login> {

  override service = inject(LoginService);

  categoryService = inject(CategoryService);

  titleService = inject(Title);

  data$: Observable<LoginData> = this.getSelectedEntity(this.service.logins).pipe(
    combineLatestWith(this.categoryService.categories, this.isViewMode$),
    map(([login, categories, isViewMode]) => ({login, categories, isViewMode})),
    tap(data => {
      let title = `LoginVault - Login ${data.login?.name}`;
      if (data.login.id === 0)
        title = `LoginVault - Login erstellen`
      else if (!data.isViewMode)
        title = `LoginVault - Login bearbeiten`
      this.titleService.setTitle(title);
    })
  );

  protected get emptyEntity(): Login {
    return {
      id: 0,
      name: "",
      imageKey: DEFAULT_IMAGE_KEY,
      url: "",
      description: "",
      username: "",
      password: "",
      category: {id: 0, name: "", createdOn: "", imageKey: DEFAULT_IMAGE_KEY},
      hashtags: []
    };
  }

}
