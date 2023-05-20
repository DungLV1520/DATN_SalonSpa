import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppinnerComponent } from './appinner.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TimelineComponent } from './timeline/timeline.component';
import { BranchesComponent } from './branches/branches.component';
import { ServicesComponent } from './services/services.component';
import { TimeBookingComponent } from './time-booking/time-booking.component';
import { SuccessBookingComponent } from './success-booking/success-booking.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AppinnerComponent,
    children: [
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'guide-booking',
        component: TimelineComponent,
      },
      {
        path: 'branches',
        component: BranchesComponent,
      },
      {
        path: 'services',
        children: [
          { path: '', component: ServicesComponent },
          {
            path: ':id',
            component: ServiceDetailComponent,
          },
        ],
      },
      {
        path: 'time-booking',
        component: TimeBookingComponent,
      },
      {
        path: 'success-booking',
        component: SuccessBookingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppinnerlayoutRoutingModule {}
