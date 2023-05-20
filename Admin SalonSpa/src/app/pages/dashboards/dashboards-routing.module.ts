import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WidgetsComponent } from "./widgets/widgets.component";

const routes: Routes = [
  {
    path: "",
    component: WidgetsComponent,
  },
  {
    path: "projects",
    component: WidgetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
