import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { CountToModule } from "angular-count-to";
import { SimplebarAngularModule } from "simplebar-angular";
import { NgApexchartsModule } from "ng-apexcharts";
import { FlatpickrModule } from "angularx-flatpickr";
import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { WidgetsComponent } from "./widgets/widgets.component";

@NgModule({
  declarations: [WidgetsComponent],
  imports: [
    CommonModule,
    NgbToastModule,
    FeatherModule.pick(allIcons),
    CountToModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgApexchartsModule,
    FlatpickrModule.forRoot(),
    DashboardsRoutingModule,
    SharedModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
  ],
})
export class DashboardsModule {}
