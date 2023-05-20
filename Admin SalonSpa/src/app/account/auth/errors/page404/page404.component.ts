import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalComponent, RoleSpa } from "src/app/app.constant";

@Component({
  selector: "app-page404",
  templateUrl: "./page404.component.html",
  styleUrls: ["./page404.component.scss"],
})
export class Page404Component implements OnInit {
  RoleSpa = RoleSpa;
  year: number = new Date().getFullYear();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  back(): void {
    const objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    objLocal.role === RoleSpa.ROLE_USER
      ? this.router.navigate(["/landing/booking"])
      : this.router.navigate(["/ecommerce/booking"]);
  }
}
