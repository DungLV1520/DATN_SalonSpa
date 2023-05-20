import { Component, OnInit, ViewChild } from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

import { defaultData, dismissingData } from './data';
import { AlertColor } from './alerts.model';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  defaultData: AlertColor[] = [];
  dismissingData: AlertColor[] = [];
  alertData: AlertColor[] = [];
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';
  @ViewChild('staticAlert', { static: false })
  staticAlert!: NgbAlert;
  @ViewChild('selfClosingAlert', { static: false })
  selfClosingAlert!: NgbAlert;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Base UI' },
      { label: 'Alerts', active: true }
    ];

    // Alert Message Append
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    /***
     * Data Get
    */
     this._fetchData();
  }

   /***
   * Data Get
   */
    private _fetchData() {
      this.defaultData = defaultData;
      this.dismissingData = dismissingData;
    }

  /***
   * Alerts remove notification
   */
   close(alert: AlertColor, alertData: AlertColor[]) {
    alertData.splice(alertData.indexOf(alert), 1);
  }

  /**
   * Alert Model Msg Get
   */
  public changeSuccessMessage() { this._success.next(`Nice, you triggered this alert message!`); }

  /**
   * Show Code Toggle
   */
   ShowCode(event: any) {
    let card = event.target.closest('.card');
    const preview = card.children[1].children[1];
    const codeView = card.children[1].children[2];
    if(codeView != null){
      codeView.classList.toggle('d-none');
    }
    if(preview != null){
      preview.classList.toggle('d-none');
      
    }
  }

}
