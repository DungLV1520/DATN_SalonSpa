import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { finalize } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { GlobalComponent, TypeNotify } from 'src/app/app.constant';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookingService } from 'src/app/shared/service/booking.service';
import { Router } from '@angular/router';
import { ServicesModel } from 'src/app/shared/model/home.model';
import { BookingModel } from 'src/app/shared/model/booking.model';

@Component({
  selector: 'app-time-booking',
  templateUrl: './time-booking.component.html',
  styleUrls: ['./time-booking.component.scss'],
})
export class TimeBookingComponent implements OnInit {
  hours: Array<string> = [];
  timeBookingLine!: string;
  timeBooking!: string;
  selectedDate!: Date;
  isActive = 0;
  profileData: any;
  showSuccess = true;
  socket!: Socket<DefaultEventsMap>;

  constructor(
    private bookingService: BookingService,
    private toast: HotToastService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socketBooking();
    this.getProfile();
    this.generateHours(0);
  }

  getProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profileData = res.staff;
      },
    });
  }

  socketBooking(): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    this.socket.emit('join', GlobalComponent.SOCKET_ROOM_ID);
    this.socket.on('thread', (data: any) => {
      // TODO
      console.log(data);
    });
  }

  generateHours(dayAdd: number): void {
    const hours = [];
    this.selectedDate = new Date();
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const day = this.selectedDate.getDate();

    this.selectedDate = new Date(year, month, day + dayAdd);

    const startHour = new Date(year, month, day + dayAdd, 7, 0);
    const endHour = new Date(year, month, day + dayAdd, 23, 0);

    while (startHour <= endHour) {
      const hour = startHour.getHours().toString().padStart(2, '0');
      const minute = startHour.getMinutes().toString().padStart(2, '0');
      const time = `${hour}:${minute}`;
      hours.push(time);
      startHour.setMinutes(startHour.getMinutes() + 20);
    }

    this.hours = [...hours];
  }

  isPast(hour: string): boolean {
    const hourDate = new Date(`${this.selectedDate.toDateString()} ${hour}`);
    return hourDate.getTime() < this.getCurrentTime().getTime();
  }

  onDateChange(day: number): void {
    this.hours = [];
    this.generateHours(day);
    this.isActive = day;
  }

  getCurrentTime(): Date {
    return new Date();
  }

  getTimeBooking(time: string): void {
    this.timeBooking = new Date(
      `${this.selectedDate.toDateString()} ${time}`
    ).toISOString();

    const dateString = new Date(
      `${this.selectedDate.toDateString()} ${time}`
    ).toLocaleDateString('en-US');
    const timeString = new Date(
      `${this.selectedDate.toDateString()} ${time}`
    ).toLocaleTimeString('en-US');

    this.timeBookingLine = `${dateString} ${timeString}`;
    localStorage.setItem(GlobalComponent.TIME_BOOKING, this.timeBooking);
  }

  radioClick(index: number) {
    for (let i = 0; i < this.hours?.length; i++) {
      const radioBtn = document.getElementById(`${i}`)! as HTMLInputElement;
      if (i !== index) {
        radioBtn!.checked! = false;
      }
    }
  }

  showDate(dayOffset: number): string {
    const today = new Date();
    today.setDate(today.getDate() + dayOffset);
    const dayOfWeek = today.getDay();
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return `${daysOfWeek[dayOfWeek]}(${today.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })})`;
  }

  bookingForUser(): void {
    const branchBooking = JSON.parse(
      localStorage.getItem(GlobalComponent.BRANCH_BOOKING)!
    );

    const serviceBooking = JSON.parse(
      localStorage.getItem(GlobalComponent.SERVICES_BOOKING)!
    );

    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: 'top-center',
    });

    const objBooking: any = {
      name: this.profileData?.fullname,
      phone: this.profileData?.phone,
      quantity: 1,
      time: this.timeBooking,
      branch: branchBooking._id,
      services: serviceBooking.map((service: ServicesModel) => service._id),
    };
    this.showSuccess = true;

    this.bookingService
      .addBooking(objBooking)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          localStorage.setItem(GlobalComponent.ID_BOOKING, res._id);
          this.showSuccess = true;
          this.toast.success('Booking successfully', {
            duration: 3000,
            position: 'top-center',
          });

          const objNotification = {
            room: GlobalComponent.SOCKET_ROOM_ID,
            data: {
              idUser: this.profileData?._id,
              branch: branchBooking?._id,
              type: TypeNotify.BOOKING,
              content: 'A new booking has been created.',
            },
            isDuplicate: false,
          };

          this.socket.emit('messages', objNotification);
          this.socket.emit('join', branchBooking._id);
          this.socket.emit('messages', {
            ...objNotification,
            isDuplicate: true,
          });

          this.router.navigate(['/success-booking']);
        },
        error: (error) => {
          this.showSuccess = false;
          this.toast.error(error, {
            duration: 3000,
            position: 'top-center',
          });
        },
      });
  }
}
