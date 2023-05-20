import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbCarouselModule,
  NgbTooltipModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SimplebarAngularModule } from "simplebar-angular";
import { FlatpickrModule } from "angularx-flatpickr";
import { NgSelectModule } from "@ng-select/ng-select";

import { LandingRoutingModule } from "./landing-routing.module";
import { SharedModule } from "../shared/shared.module";
import { BookingComponent } from "./booking/booking.component";
import { NgxMaskModule } from "ngx-mask";
import { SuccessComponent } from "./payment/success/success.component";
import { ErrorComponent } from "./payment/error/error.component";
import { NgOtpInputModule } from "ng-otp-input";
import { ArchwizardModule } from "angular-archwizard";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

@NgModule({
  declarations: [BookingComponent, SuccessComponent, ErrorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbCarouselModule,
    LandingRoutingModule,
    SharedModule,
    NgbTooltipModule,
    NgbCollapseModule,
    ScrollToModule.forRoot(),
    FormsModule,
    SimplebarAngularModule,
    FlatpickrModule.forRoot(),
    NgSelectModule,
    NgbDropdownModule,
    NgxMaskModule.forRoot(),
    NgOtpInputModule,
    ArchwizardModule,
    NgbNavModule,
    NgxSkeletonLoaderModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingModule {}
