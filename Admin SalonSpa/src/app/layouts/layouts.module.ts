import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbDropdownModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { SimplebarAngularModule } from "simplebar-angular";
import { LanguageService } from "../core/services/language.service";
import { TranslateModule } from "@ngx-translate/core";
import { LayoutComponent } from "./layout.component";
import { VerticalComponent } from "./vertical/vertical.component";
import { TopbarComponent } from "./topbar/topbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FooterComponent } from "./footer/footer.component";
import { RightsidebarComponent } from "./rightsidebar/rightsidebar.component";
import { HorizontalComponent } from "./horizontal/horizontal.component";
import { HorizontalTopbarComponent } from "./horizontal-topbar/horizontal-topbar.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { ReactiveFormsModule } from "@angular/forms";
import { NgOtpInputModule } from "ng-otp-input";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

@NgModule({
  declarations: [
    LayoutComponent,
    VerticalComponent,
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
    RightsidebarComponent,
    HorizontalComponent,
    HorizontalTopbarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    TranslateModule,
    NgSelectModule,
    NgOtpInputModule,
    NgxSkeletonLoaderModule.forRoot(),
  ],
  providers: [LanguageService],
})
export class LayoutsModule {}
