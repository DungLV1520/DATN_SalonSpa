import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbCarouselModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";
import { AccountRoutingModule } from "./account-routing.module";
import { RegisterComponent } from "./auth/register/register.component";
import { PassCreateComponent } from "./auth/pass-create/pass-create.component";
import { NgOtpInputModule } from "ng-otp-input";
import { TwoStepComponent } from "./auth/twostep/twostep.component";
import { PassResetComponent } from "./auth/pass-reset/pass-reset.component";
import { LockScreenComponent } from "./auth/lockscreen/lockscreen.component";
import { SuccessPassComponent } from "./auth/success-pass/success-pass.component";
import { LoginComponent } from "./auth/login/login.component";
import { NgxMaskModule } from "ngx-mask";

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    PassCreateComponent,
    TwoStepComponent,
    SuccessPassComponent,
    PassResetComponent,
    LockScreenComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    AccountRoutingModule,
    NgOtpInputModule,
    NgbCarouselModule,
    NgxMaskModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
