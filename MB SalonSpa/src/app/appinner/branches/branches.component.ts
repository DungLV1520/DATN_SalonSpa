import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { FilterAll, GlobalComponent } from 'src/app/app.constant';
import { BranchModel } from 'src/app/shared/model/home.model';
import { HomeService } from 'src/app/shared/service/home.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
})
export class BranchesComponent implements OnInit {
  branches: BranchModel[] = [];
  branchBooking!: BranchModel;
  isSkeleton = false;
  activeIndex: number = -1;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getBranch();
  }

  getBranch(): void {
    this.isSkeleton = false;
    this.homeService
      .getAllBranches(FilterAll)
      .pipe(finalize(() => (this.isSkeleton = true)))
      .subscribe({
        next: (data: any) => {
          this.branches = data.users;
        },
      });
  }

  setActiveIndex(index: number): void {
    this.activeIndex = index;
  }

  getDataChooseBranch(data: BranchModel): void {
    this.branchBooking = data;
  }

  nextStepBooking(): void {
    localStorage.setItem(
      GlobalComponent.BRANCH_BOOKING,
      JSON.stringify(this.branchBooking)
    );
  }
}
