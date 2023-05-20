import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbNavModule,
  NgbAccordionModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import { CountToModule } from "angular-count-to";
import { NgxMaskModule } from "ngx-mask";

import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { ScrollspyDirective } from "./scrollspy.directive";
import { BranchesComponent } from "./landing/branches/branches.component";
import { PostComponent } from "./landing/posts/posts.component";
import { ServicesComponent } from "./landing/services/services.component";
import { BookingFooterComponent } from "./landing/footer/footer.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    ScrollspyDirective,
    BranchesComponent,
    PostComponent,
    ServicesComponent,
    BookingFooterComponent,
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    CountToModule,
    NgxMaskModule,
    TranslateModule,
  ],
  exports: [
    BreadcrumbsComponent,
    ScrollspyDirective,
    BranchesComponent,
    PostComponent,
    ServicesComponent,
    BookingFooterComponent,
    TranslateModule,
  ],
})
export class SharedModule {}
