import { Component, OnInit } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { HomeService } from 'src/app/shared/service/home.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  totalNotification = 0;
  checkSkeleton = true;
  checkSkeletonFirst = false;
  arrayNotification: any[] = [];
  page = 1;
  totalPages = 0;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    const footerhide: any = document.getElementsByTagName('app-footerinfo')[0];
    footerhide.remove();

    this.getNotification(1);
  }

  onScrollEnd(): void {
    if (this.page <= this.totalPages) {
      this.checkSkeleton = false;
      this.getNotification(this.page);
    }
  }

  getNotification(page: number): void {
    const objQuery = { page, size: 10 };
    this.page = page;
    this.page++;

    const getAllNotiFn = this.homeService.getAllNotificationbyUser.bind(
      this.homeService
    );

    const notification$ = getAllNotiFn(undefined, objQuery).pipe(
      tap((res: any) => {
        this.totalNotification = res.count;
        this.totalPages = res.total_page;
        this.arrayNotification = [
          ...this.arrayNotification,
          ...res.notifications,
        ];
      }),
      finalize(() => {
        this.checkSkeleton = true;
        this.checkSkeletonFirst = true;
      })
    );

    notification$.subscribe();
  }

  getTimeDifference(messageTime: any): string {
    let currentTime = new Date();
    let messageDate = new Date(messageTime);
    let timeDiff = Math.abs(currentTime.getTime() - messageDate.getTime());
    // chuyển đổi khoảng thời gian thành giây
    let diffSeconds = Math.floor(timeDiff / 1000);

    if (diffSeconds < 60) {
      return diffSeconds + ' sec ago';
    } else if (diffSeconds < 60 * 60) {
      let diffMinutes = Math.floor(diffSeconds / 60);
      return diffMinutes + ' min ago';
    } else if (diffSeconds < 60 * 60 * 24) {
      let diffHours = Math.floor(diffSeconds / (60 * 60));
      return diffHours + ' hour ago';
    } else if (diffSeconds < 60 * 60 * 24 * 7) {
      let diffDays = Math.floor(diffSeconds / (60 * 60 * 24));
      return diffDays + ' day ago';
    } else if (diffSeconds < 60 * 60 * 24 * 30) {
      let diffWeeks = Math.floor(diffSeconds / (60 * 60 * 24 * 7));
      return diffWeeks + ' week ago';
    } else if (diffSeconds < 60 * 60 * 24 * 365) {
      let diffMonths = Math.floor(diffSeconds / (60 * 60 * 24 * 30));
      return diffMonths + ' month ago';
    } else {
      let diffYears = Math.floor(diffSeconds / (60 * 60 * 24 * 365));
      return diffYears + ' year ago';
    }
  }
}
