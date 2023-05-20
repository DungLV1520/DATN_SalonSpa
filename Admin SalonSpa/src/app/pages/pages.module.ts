import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  NgbToastModule,
  NgbProgressbarModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FlatpickrModule } from "angularx-flatpickr";
import { CountToModule } from "angular-count-to";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SimplebarAngularModule } from "simplebar-angular";
import { LightboxModule } from "ngx-lightbox";
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";

import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";
import { DashboardsModule } from "./dashboards/dashboards.module";
import { EntitiesModule } from "./entities/entities.module";
import { EcommerceModule } from "./ecommerce/ecommerce.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    NgbProgressbarModule,
    FlatpickrModule.forRoot(),
    CountToModule,
    NgApexchartsModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    PagesRoutingModule,
    SharedModule,
    LightboxModule,
    DashboardsModule,
    EntitiesModule,
    EcommerceModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
