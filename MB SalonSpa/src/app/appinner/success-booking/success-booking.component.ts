import { Component, OnInit } from '@angular/core';
import { GlobalComponent } from 'src/app/app.constant';
import { BranchModel } from 'src/app/shared/model/home.model';

@Component({
  selector: 'app-success-booking',
  templateUrl: './success-booking.component.html',
  styleUrls: ['./success-booking.component.scss'],
})
export class SuccessBookingComponent implements OnInit {
  branchBooking!: BranchModel | null;
  timeBooking!: string;
  idBooking!: string;

  constructor() {}

  ngOnInit(): void {
    this.timeBooking = localStorage.getItem(GlobalComponent.TIME_BOOKING)!;
    this.idBooking = localStorage.getItem(GlobalComponent.ID_BOOKING)!;
    this.branchBooking = JSON.parse(
      localStorage.getItem(GlobalComponent.BRANCH_BOOKING)!
    );
  }
}
