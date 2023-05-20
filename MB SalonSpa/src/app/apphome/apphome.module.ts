import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ApphomeRoutingModule } from './apphome-routing.module';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from './settings/settings.component';
import { ApphomeComponent } from './apphome.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BillsComponent } from './bills/bills.component';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { NgxMaskModule } from 'ngx-mask';
import { VerifyComponent } from './settings/verify/verify.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    ApphomeComponent,
    SettingsComponent,
    BookingsComponent,
    BillsComponent,
    ChatlistComponent,
    VerifyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ApphomeRoutingModule,
    SwiperModule,
    NgCircleProgressModule.forRoot(),
    NgSelectModule,
    NgbDatepickerModule,
    NgxMaskModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot(),
  ],
})
export class AppHomeModule {}
