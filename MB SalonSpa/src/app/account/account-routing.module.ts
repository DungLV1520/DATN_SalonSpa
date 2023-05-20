import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PasswordCreateComponent } from './auth/pass-create/pass-create.component';
import { PasswordResetComponent } from './auth/pass-resset/pass-resset.component';
import { ThankyouComponent } from './auth/thankyou/thankyou.component';
import { VerifyComponent } from './auth/verify/verify.component';

const routes: Routes = [
  {
    path: 'login',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'create-password',
    component: PasswordCreateComponent,
  },
  {
    path: 'reset-password',
    component: PasswordResetComponent,
  },
  {
    path: 'thankyou',
    component: ThankyouComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
  {
    path: 'errors',
    loadChildren: () =>
      import('./auth/errors/errors.module').then((m) => m.ErrorsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
