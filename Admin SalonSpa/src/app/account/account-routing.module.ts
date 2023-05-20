import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./auth/register/register.component";
import { PassCreateComponent } from "./auth/pass-create/pass-create.component";
import { PassResetComponent } from "./auth/pass-reset/pass-reset.component";
import { TwoStepComponent } from "./auth/twostep/twostep.component";
import { LockScreenComponent } from "./auth/lockscreen/lockscreen.component";
import { SuccessPassComponent } from "./auth/success-pass/success-pass.component";
import { LoginComponent } from "./auth/login/login.component";

const routes: Routes = [
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "pass-reset",
    component: PassResetComponent,
  },
  {
    path: "pass-create",
    component: PassCreateComponent,
  },
  {
    path: "lockscreen",
    component: LockScreenComponent,
  },
  {
    path: "success-pass",
    component: SuccessPassComponent,
  },
  {
    path: "twostep",
    component: TwoStepComponent,
  },
  {
    path: "errors",
    loadChildren: () =>
      import("./auth/errors/errors.module").then((m) => m.ErrorsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
