import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { CategoriesViewComponent } from "./views/categories-view.component";
import { LoginsViewComponent } from "./views/logins-view.component";
import { LoginDetailViewComponent } from "./views/login-detail-view.component";
import { LoginDescriptionComponent } from "./ui-components/descriptions/login-description.component";
import { CategoryDescriptionComponent } from "./ui-components/descriptions/category-description.component";
import { CategoryDetailViewComponent } from "./views/category-detail-view.component";
import { AuthGuard } from "./shared/guards/auth.guard";

const routes: Routes = [
  {
    path: "categories",
    component: CategoriesViewComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: CategoryDescriptionComponent,
        title: "LoginVault - Kategorien"
      },
      {
        path: "new",
        component: CategoryDetailViewComponent,
        title: "LoginVault - Kategorie erstellen",
      },
      {
        path: ":id/edit",
        component: CategoryDetailViewComponent,
        title: "LoginVault - Kategorie bearbeiten",
      }
    ]
  },
  {
    path: "logins",
    component: LoginsViewComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: LoginDescriptionComponent,
        title: "LoginVault - Logins"
      },
      {
        matcher: (segments: UrlSegment[]) => {
          if (segments.length === 1) {
            if (segments[0].path == "new")
              return {consumed: segments};
            return {consumed: segments, posParams: {id: segments[0]}};
          }

          if (segments.length == 2 && segments[1].path == "edit")
            return {consumed: segments, posParams: {id: segments[0]}};

          return null;
        },
        component: LoginDetailViewComponent
      }
    ]
  },
  {
    path: "**",
    redirectTo: "/categories",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
