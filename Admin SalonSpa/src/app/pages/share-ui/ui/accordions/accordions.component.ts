import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss']
})
export class AccordionsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public Collapsed = false;
  public HCollapsed = false;
  public DownCollapsed = false;
  public FilterCollapsed = false;
  public InlineCollapsed = false;
  public BlockCollapsed = false;
  public firstColleaps = false;
  public secondColleaps = false;
  public bothColleaps = false;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Base UI' },
      { label: 'Accordions', active: true }
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
