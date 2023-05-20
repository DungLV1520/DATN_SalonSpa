import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbAccordionModule,
  NgbRatingModule,
  NgbTooltipModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxMaskModule } from "ngx-mask";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { SimplebarAngularModule } from "simplebar-angular";
import { FlatpickrModule } from "angularx-flatpickr";
import { NgSelectModule } from "@ng-select/ng-select";
import { ArchwizardModule } from "angular-archwizard";
import { CountToModule } from "angular-count-to";
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

import { EcommerceRoutingModule } from "./ecommerce-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { BookingComponent } from "./bookings/bookings.component";
import { BillAdminComponent } from "./bill-admin/bill-admin.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { MarketComponent } from "./market/market.component";
import { BillEmployeeComponent } from "./bill-employee/bill-employee.component";

@NgModule({
  declarations: [
    BookingComponent,
    CartComponent,
    CheckoutComponent,
    MarketComponent,
    BillAdminComponent,
    BillEmployeeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbRatingModule,
    NgbTooltipModule,
    NgxSliderModule,
    SimplebarAngularModule,
    FlatpickrModule.forRoot(),
    NgSelectModule,
    ArchwizardModule,
    CountToModule,
    EcommerceRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    NgbCollapseModule,
    NgxSkeletonLoaderModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EcommerceModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
