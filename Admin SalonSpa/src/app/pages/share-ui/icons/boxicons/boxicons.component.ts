import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast-service';


@Component({
  selector: 'app-boxicons',
  templateUrl: './boxicons.component.html',
  styleUrls: ['./boxicons.component.scss']
})

/**
 * Boxicons Component
 */
export class BoxiconsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Icons' },
      { label: 'Boxicons', active: true }
    ];
  }


  copytext(event: any) {
    var element = event.target.querySelector('i').className
    navigator.clipboard.writeText(element);
    this.toastService.show(element + ' icon Copied Successfully !!!', { classname: 'bg-success text-center text-white', delay: 5000 });
  }

}
