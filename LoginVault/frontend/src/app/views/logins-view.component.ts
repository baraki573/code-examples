import { Component, inject } from '@angular/core';
import { LoginService } from "../shared/services/login.service";
import { Login } from "../shared/models/login";
import { ActivatedRoute } from "@angular/router";
import { combineLatestWith, map, Observable } from "rxjs";

@Component({
  selector: 'app-logins-view',
  templateUrl: './logins-view.component.html',
  styleUrls: ['./logins-view.component.scss']
})
export class LoginsViewComponent {

  loginService: LoginService = inject(LoginService);

  route: ActivatedRoute = inject(ActivatedRoute);

  categoryName$: Observable<string | null> = this.route.queryParamMap.pipe(
    map(m => m.get("categoryName"))
  );

  logins$: Observable<Login[]> = this.categoryName$.pipe(
    combineLatestWith(this.loginService.logins),
    map(([categoryName, logins]) => {
      if (categoryName === null || categoryName.length === 0)
        return logins;
      return logins.filter(l => l.category.name === categoryName);
    })
  );

  protected readonly location = location;
}
