import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ApphomeComponent } from './apphome.component';
import { SettingsComponent } from './settings/settings.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BillsComponent } from './bills/bills.component';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { VerifyComponent } from './settings/verify/verify.component';

const routes: Routes = [
  {
    path: '',
    component: ApphomeComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'setting',
        component: SettingsComponent,
      },
      {
        path: 'booking',
        component: BookingsComponent,
      },
      {
        path: 'bills',
        component: BillsComponent,
      },
      {
        path: 'chat',
        component: ChatlistComponent,
      },
      {
        path: 'verify-profile',
        component: VerifyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApphomeRoutingModule {}
