
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';
import { steps as defaultSteps, defaultStepOptions} from './data';
@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Tour Component
 */
export class TourComponent implements OnInit, AfterViewInit {
  

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(private shepherdService: ShepherdService) {}

  ngAfterViewInit(): void {
    this.shepherdService.defaultStepOptions = defaultStepOptions;
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.shepherdService.addSteps(defaultSteps);
    this.shepherdService.start();
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Advance UI' },
      { label: 'Tour', active: true }
    ];
  }

}
