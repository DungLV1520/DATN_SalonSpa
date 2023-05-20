import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalComponent, RoleSpa } from "src/app/app.constant";

@Component({
  selector: "app-offline",
  templateUrl: "./offline.component.html",
  styleUrls: ["./offline.component.scss"],
})
export class OfflineComponent implements OnInit {
  RoleSpa = RoleSpa;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  backUrl(): void {
    const objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    objLocal.role === RoleSpa.ROLE_USER
      ? this.router.navigate(["/landing/booking"])
      : this.router.navigate(["/ecommerce/booking"]);
  }
}
