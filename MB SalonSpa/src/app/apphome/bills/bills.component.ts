import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { FilterAll } from 'src/app/app.constant';
import { BillService } from 'src/app/shared/service/bill.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {
  billUserData: any;
  isSkeleton = false;

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.getMyBill();
  }

  getMyBill(): void {
    this.isSkeleton = false;
    this.billService
      .getAllMyBill(FilterAll)
      .pipe(finalize(() => (this.isSkeleton = true)))
      .subscribe({
        next: (res: any) => {
          this.billUserData = res.users;
        },
      });
  }
}
