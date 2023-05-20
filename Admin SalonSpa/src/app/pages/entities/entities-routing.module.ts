import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChatComponent } from "./chats/chats.component";
import { PostComponent } from "./posts/posts.component";
import { NotificationComponent } from "./notifications/notifications.component";
import { ServicesComponent } from "./services/services.component";
import { BranchesComponent } from "./branches/branches.component";
import { ContactsComponent } from "./users/contacts/contacts.component";
import { EmployeesComponent } from "./users/employees/employees.component";
import { ManagersComponent } from "./users/managers/managers.component";
import { AuthManagerGuard } from "src/app/core/guards/auth-manager.guard";
import { AuthAdminGuard } from "src/app/core/guards/auth-admin.guard";
import { AuthUserGuard } from "src/app/core/guards/auth-user.guard";

const routes: Routes = [
  {
    path: "chat",
    component: ChatComponent,
    canActivate: [AuthUserGuard],
  },
  {
    path: "posts",
    component: PostComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: "notifications",
    component: NotificationComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: "services",
    component: ServicesComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: "branches",
    component: BranchesComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: "contacts",
    component: ContactsComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: "employees",
    component: EmployeesComponent,
    canActivate: [AuthManagerGuard],
  },
  {
    path: "managers",
    component: ManagersComponent,
    canActivate: [AuthAdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule {}
