import { Injectable } from "@angular/core";
import { RoleSpa } from "src/app/app.constant";
import { AuthGuard } from "./auth.guard";

@Injectable({ providedIn: "root" })
export class AuthAdminGuard extends AuthGuard {
  protected getAllowedRoles(): RoleSpa[] {
    return [RoleSpa.ROLE_ADMIN];
  }
}
