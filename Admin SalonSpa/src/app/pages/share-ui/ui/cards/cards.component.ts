import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})

/**
 * Cards Component
 */
export class CardsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Base UI' },
      { label: 'Cards', active: true }
    ];
  }

  /***
   * Masonry Option Function
   */
   public myOptions: NgxMasonryOptions = {
    horizontalOrder: true
  };

}
