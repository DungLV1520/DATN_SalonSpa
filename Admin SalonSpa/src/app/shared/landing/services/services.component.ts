import { Component, OnInit } from "@angular/core";
import { FilterAll } from "src/app/app.constant";
import { ServicesModel } from "src/app/pages/entities/services/services.model";
import { ServicesService } from "src/app/pages/entities/services/services.service";

@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
})
export class ServicesComponent implements OnInit {
  listService: ServicesModel[] = [];

  constructor(private service: ServicesService) {}

  ngOnInit(): void {
    this.getListServices();
  }

  getListServices(): void {
    this.service.getAllServices(FilterAll).subscribe({
      next: (data: any) => {
        this.listService = Object.assign([], data.users);
      },
    });
  }
}
