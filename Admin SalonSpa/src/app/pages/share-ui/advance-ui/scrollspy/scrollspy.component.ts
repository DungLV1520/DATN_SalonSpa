import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scrollspy',
  templateUrl: './scrollspy.component.html',
  styleUrls: ['./scrollspy.component.scss']
})

/**
 * Scrollspy Component
 */
export class ScrollspyComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Advance UI' },
      { label: 'ScrollSpy', active: true }
    ];
  }

  inView(ele:any){
    ele.scrollIntoView({behavior:"smooth", block:"start", inline:"start"})
  }

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
