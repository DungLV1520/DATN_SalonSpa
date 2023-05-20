import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FooterinfoComponent } from './partials/footerinfo/footerinfo.component';
import { HeaderbackComponent } from './partials/headerback/headerback.component';
import { AppinnerlayoutRoutingModule } from './appinner-routing.module';
import { AppinnerComponent } from './appinner.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TimelineComponent } from './timeline/timeline.component';
import { BranchesComponent } from './branches/branches.component';
import { ServicesComponent } from './services/services.component';
import { TimeBookingComponent } from './time-booking/time-booking.component';
import { SuccessBookingComponent } from './success-booking/success-booking.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ScrollNotiDirective } from './notifications/scroll-notify.directive';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    AppinnerComponent,
    FooterinfoComponent,
    HeaderbackComponent,
    NotificationsComponent,
    TimelineComponent,
    BranchesComponent,
    ServicesComponent,
    TimeBookingComponent,
    SuccessBookingComponent,
    ServiceDetailComponent,
    ScrollNotiDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppinnerlayoutRoutingModule,
    SwiperModule,
    NgCircleProgressModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot(),
    NgxMaskModule.forRoot(),
  ],
})
export class AppInnerModule {}
