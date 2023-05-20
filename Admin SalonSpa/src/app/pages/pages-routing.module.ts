import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthAdminGuard } from "../core/guards/auth-admin.guard";
import { AuthUserGuard } from "../core/guards/auth-user.guard";
import { AuthManagerGuard } from "../core/guards/auth-manager.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./dashboards/dashboards.module").then((m) => m.DashboardsModule),
    canActivate: [AuthUserGuard],
  },
  {
    path: "entities",
    loadChildren: () =>
      import("./entities/entities.module").then((m) => m.EntitiesModule),
    canActivate: [AuthManagerGuard],
  },
  {
    path: "ecommerce",
    loadChildren: () =>
      import("./ecommerce/ecommerce.module").then((m) => m.EcommerceModule),
    canActivate: [AuthUserGuard],
  },
  {
    path: "ui",
    loadChildren: () =>
      import("./share-ui/ui/ui.module").then((m) => m.UiModule),
    canActivate: [AuthUserGuard],
  },
  {
    path: "advance-ui",
    loadChildren: () =>
      import("./share-ui/advance-ui/advance-ui.module").then(
        (m) => m.AdvanceUiModule
      ),
    canActivate: [AuthUserGuard],
  },
  {
    path: "forms",
    loadChildren: () =>
      import("./share-ui/form/form.module").then((m) => m.FormModule),
    canActivate: [AuthUserGuard],
  },
  {
    path: "charts",
    loadChildren: () =>
      import("./share-ui/charts/charts.module").then((m) => m.ChartsModule),
    canActivate: [AuthUserGuard],
  },
  {
    path: "icons",
    loadChildren: () =>
      import("./share-ui/icons/icons.module").then((m) => m.IconsModule),
    canActivate: [AuthUserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
