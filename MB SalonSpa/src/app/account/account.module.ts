import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { PasswordResetComponent } from './auth/pass-resset/pass-resset.component';
import { PasswordCreateComponent } from './auth/pass-create/pass-create.component';
import { ThankyouComponent } from './auth/thankyou/thankyou.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { ErrorsModule } from './auth/errors/errors.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent,
    PasswordResetComponent,
    PasswordCreateComponent,
    ThankyouComponent,
    VerifyComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    IonicModule,
    FormsModule,
    ErrorsModule,
    NgxMaskModule.forRoot(),
  ],
})
export class AccountModule {}
