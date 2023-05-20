import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FilterAll } from 'src/app/app.constant';
import {
  BranchModel,
  PostModel,
  ServicesModel,
} from 'src/app/shared/model/home.model';
import { HomeService } from 'src/app/shared/service/home.service';

import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from 'swiper/core';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  today: string = 'Today, ' + formatDate(new Date(), 'dd MMM yyyy', 'en-US');
  listService: ServicesModel[] = [];
  branches: BranchModel[] = [];
  postData: PostModel[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getListServices();
    this.getBranch();
    this.getPosts();
  }

  greeting(): string {
    const today = new Date();
    const hour = today.getHours();
    let greeting;

    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    return greeting;
  }

  getListServices(): void {
    this.homeService.getAllServices(FilterAll).subscribe({
      next: (data: any) => {
        this.listService = Object.assign([], data.users);
      },
    });
  }

  getBranch(): void {
    this.homeService.getAllBranches(FilterAll).subscribe({
      next: (data: any) => {
        this.branches = data.users;
      },
    });
  }

  getPosts(): void {
    this.homeService.getAllPosts({ page: 1, size: 3 }).subscribe({
      next: (data: any) => {
        this.postData = data.users;
      },
    });
  }
}
