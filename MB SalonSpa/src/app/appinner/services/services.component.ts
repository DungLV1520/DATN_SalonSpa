import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { FilterAll, GlobalComponent } from 'src/app/app.constant';
import { ServicesModel } from 'src/app/shared/model/home.model';
import { HomeService } from 'src/app/shared/service/home.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  listService: ServicesModel[] = [];
  serviceBooking: Array<any> = [];
  isSkeleton = false;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getListServices();
  }

  getListServices(): void {
    this.isSkeleton = false;
    this.homeService
      .getAllServices(FilterAll)
      .pipe(finalize(() => (this.isSkeleton = true)))
      .subscribe({
        next: (data: any) => {
          this.listService = Object.assign([], data.users);
        },
      });
  }

  getServiceBooking(data: any): void {
    const index = this.serviceBooking.findIndex(
      (item) => item._id === data._id
    );
    if (index !== -1) {
      this.serviceBooking.splice(index, 1);
    } else {
      this.serviceBooking.push(data);
    }
  }

  isServiceBooking(data: ServicesModel[]): boolean {
    return data.length === 0;
  }

  nextStepBooking(): void {
    localStorage.setItem(
      GlobalComponent.SERVICES_BOOKING,
      JSON.stringify(this.serviceBooking)
    );
  }
}
