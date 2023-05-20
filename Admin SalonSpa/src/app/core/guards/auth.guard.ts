import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { User } from "../models/auth.models";
import { GlobalComponent, RoleSpa } from "src/app/app.constant";

@Injectable({ providedIn: "root" })
export abstract class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  checkRole(roles: RoleSpa[]): boolean {
    const currentUser: User = this.authService.currentManagerValue;
    return currentUser && roles.includes(currentUser?.role as RoleSpa);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser: User = this.authService.currentManagerValue;
    const checkActive = localStorage.getItem(GlobalComponent.CUSTOMER_KEY);

    if (
      (currentUser || checkActive) &&
      this.checkRole(this.getAllowedRoles())
    ) {
      return true;
    }

    if (checkActive) {
      this.router.navigate(["/auth/errors/offline"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    this.router.navigate(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });

    return false;
  }

  protected abstract getAllowedRoles(): RoleSpa[];
}
