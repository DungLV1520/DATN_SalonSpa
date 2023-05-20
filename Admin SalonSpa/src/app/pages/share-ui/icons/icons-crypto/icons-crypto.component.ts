import { Component, OnInit } from '@angular/core';
import { ToastService } from '../toast-service';

@Component({
  selector: 'app-icons-crypto',
  templateUrl: './icons-crypto.component.html',
  styleUrls: ['./icons-crypto.component.scss']
})

/**
 * IconsCrypto Component
 */
export class IconsCryptoComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Icons' },
      { label: 'Crypto Icons', active: true }
    ];
  }

  copytext(event: any) {
    var element = event.target.innerHTML
    navigator.clipboard.writeText(element);
    this.toastService.show(element + ' icon Copied Successfully !!!', { classname: 'bg-success text-center text-white', delay: 5000 });
  }

}
