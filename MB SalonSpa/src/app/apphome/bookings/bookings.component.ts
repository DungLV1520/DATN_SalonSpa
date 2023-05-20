import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { finalize } from 'rxjs';
import { FilterAll } from 'src/app/app.constant';
import { BookingService } from 'src/app/shared/service/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  bookingUserData: any;
  isSkeleton = false;

  constructor(
    private bookingService: BookingService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getMyBooking();
  }

  getMyBooking(): void {
    this.isSkeleton = false;
    this.bookingService
      .getMyBooking(FilterAll)
      .pipe(finalize(() => (this.isSkeleton = true)))
      .subscribe({
        next: (res: any) => {
          this.bookingUserData = res.bookings;
        },
      });
  }

  isPastBooking(time: string): boolean {
    const currentTime = new Date().getTime();
    const targetTime = new Date(time).getTime();

    if (targetTime < currentTime) {
      return false;
    } else {
      return true;
    }
  }

  cancelMyBooking(id: string): void {
    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: 'top-center',
    });

    this.bookingService
      .cancelMyBooking(id)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.toast.success(res.message, {
            duration: 3000,
            position: 'top-center',
          });
        },
        error: (error) => {
          this.toast.error(error.message, {
            duration: 3000,
            position: 'top-center',
          });
        },
      });
  }
}
