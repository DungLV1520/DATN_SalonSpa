import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BookingComponent } from "./bookings/bookings.component";
import { BillAdminComponent } from "./bill-admin/bill-admin.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { MarketComponent } from "./market/market.component";
import { BillEmployeeComponent } from "./bill-employee/bill-employee.component";
import { AuthAdminGuard } from "src/app/core/guards/auth-admin.guard";
import { AuthEmployeeGuard } from "src/app/core/guards/auth-employee.guard";

const routes: Routes = [
  {
    path: "booking",
    component: BookingComponent,
  },
  {
    path: "bill-admin",
    component: BillAdminComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: "bill-employee",
    component: BillEmployeeComponent,
    canActivate: [AuthEmployeeGuard],
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "checkout",
    component: CheckoutComponent,
  },
  {
    path: "market",
    component: MarketComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcommerceRoutingModule {}
