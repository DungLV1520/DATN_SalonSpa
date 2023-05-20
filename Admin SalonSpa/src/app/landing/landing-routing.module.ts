import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BookingComponent } from "./booking/booking.component";
import { SuccessComponent } from "./payment/success/success.component";
import { ErrorComponent } from "./payment/error/error.component";

const routes: Routes = [
  {
    path: "booking",
    component: BookingComponent,
  },
  {
    path: "success-payment",
    component: SuccessComponent,
  },
  {
    path: "cancel-payment",
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
