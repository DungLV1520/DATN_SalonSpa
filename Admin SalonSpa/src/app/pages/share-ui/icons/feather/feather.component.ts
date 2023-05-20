import { Component, OnInit } from '@angular/core';
import { Icons } from './feather-icons.model';
import { IconsData } from './data';
import { ToastService } from './toast-service';

@Component({
  selector: 'app-feather',
  templateUrl: './feather.component.html',
  styleUrls: ['./feather.component.scss']
})

/**
 * Feather Component
 */
export class FeatherComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  IconsData!: Icons[];

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Icons' },
      { label: 'Feather', active: true }
    ];

    /***
    * All Data Get
    */
    this.fetchData();
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.IconsData = IconsData;
  }


  copytext(icon: any) {
    navigator.clipboard.writeText(icon);
    this.toastService.show(icon + ' icon Copied Successfully !!!', { classname: 'bg-success text-center text-white', delay: 5000 });
  }
}
