import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})

/**
 * General Component
 */
export class GeneralComponent implements OnInit {

  page = 1;
  pages = 2;
  Disable = 1;
  Disabled = 1;
  largepage = 1;
  smallpage = 2;
  alignpage1 = 1;
  alignpage2 = 2;

   // bread crumb items
   breadCrumbItems!: Array<{}>;

   constructor() { }

   ngOnInit(): void {
      /**
     * BreadCrumb
     */
       this.breadCrumbItems = [
         { label: 'Base UI' },
         { label: 'General', active: true }
       ];
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
