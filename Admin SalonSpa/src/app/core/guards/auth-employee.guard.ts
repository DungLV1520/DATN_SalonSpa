import { Injectable } from "@angular/core";
import { RoleSpa } from "src/app/app.constant";
import { AuthGuard } from "./auth.guard";

@Injectable({ providedIn: "root" })
export class AuthEmployeeGuard extends AuthGuard {
  protected getAllowedRoles(): RoleSpa[] {
    return [RoleSpa.ROLE_MANAGER, RoleSpa.ROLE_EMPLOYEE];
  }
}
