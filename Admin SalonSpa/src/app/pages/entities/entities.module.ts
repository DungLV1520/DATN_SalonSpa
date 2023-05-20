import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbTooltipModule,
  NgbDropdownModule,
  NgbTypeaheadModule,
  NgbAccordionModule,
  NgbProgressbarModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { FullCalendarModule } from "@fullcalendar/angular";
import { FlatpickrModule } from "angularx-flatpickr";
import { SimplebarAngularModule } from "simplebar-angular";
import { CountToModule } from "angular-count-to";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { DndModule } from "ngx-drag-drop";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTableModule } from "@angular/material/table";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgSelectModule } from "@ng-select/ng-select";
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { NgxMaskModule } from "ngx-mask";

import { EntitiesRoutingModule } from "./entities-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { ChatComponent } from "./chats/chats.component";
import { PostComponent } from "./posts/posts.component";
import { NotificationComponent } from "./notifications/notifications.component";
import { ServicesComponent } from "./services/services.component";
import { BranchesComponent } from "./branches/branches.component";
import { ContactsComponent } from "./users/contacts/contacts.component";
import { EmployeesComponent } from "./users/employees/employees.component";
import { ManagersComponent } from "./users/managers/managers.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ChatComponent,
    PostComponent,
    NotificationComponent,
    ServicesComponent,
    BranchesComponent,
    ContactsComponent,
    EmployeesComponent,
    ManagersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbProgressbarModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbCollapseModule,
    Ng2SearchPipeModule,
    FeatherModule.pick(allIcons),
    FullCalendarModule,
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    CountToModule,
    EntitiesRoutingModule,
    SharedModule,
    PickerModule,
    DndModule,
    DragDropModule,
    MatTableModule,
    FlexLayoutModule,
    NgSelectModule,
    NgbTypeaheadModule,
    NgxMaskModule.forRoot(),
    CommonModule,
    NgxSkeletonLoaderModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EntitiesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
