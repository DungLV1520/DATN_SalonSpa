import { Component, OnInit } from "@angular/core";
import { FilterAll } from "src/app/app.constant";
import { BranchModel } from "src/app/pages/entities/branches/branches.model";
import { BranchesService } from "src/app/pages/entities/branches/branches.service";

@Component({
  selector: "app-branches",
  templateUrl: "./branches.component.html",
  styleUrls: ["./branches.component.scss"],
})
export class BranchesComponent implements OnInit {
  branches: BranchModel[] = [];

  constructor(private branchesService: BranchesService) {}

  ngOnInit(): void {
    this.getBranch();
  }

  getBranch(): void {
    this.branchesService.getAllBranches(FilterAll).subscribe({
      next: (data: any) => {
        this.branches = data.body.users;
      },
    });
  }
}
