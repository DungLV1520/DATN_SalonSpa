import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss']
})
export class ModalsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Base UI' },
      { label: 'Modals', active: true }
    ];
  }

  /**
   * Open modal
   * @param content modal content
   */
   openModal(content: any) {
    this.modalService.open(content);
  }

  /**
   * Open center modal
   * @param centerDataModal center modal data
   */
   centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }

  /**
   * Lunch modal
   * @param content modal content
   */
   LunchModal(content: any) {
    this.modalService.open(content);
  }

  /**
   * Static modal
   * @param StaticDataModal modal content
   */
   StaticModal(StaticDataModal: any) {
    this.modalService.open(StaticDataModal, { centered: true });
  }

   /**
   * Open scroll modal
   * @param toggleDataModal scroll modal data
   */
    toggleModal(staticDataModal: any) {
      this.modalService.open(staticDataModal, { centered: true });
    }
    secondModal(toggleSecondModal: any) {
      this.modalService.open(toggleSecondModal, { centered: true });
    }

    /**
   * Lunch Demo modal
   * @param content modal content
   */
   LunchDemoModal(content: any) {
    this.modalService.open(content);
  }

   /**
   * Open scroll modal
   * @param scrollDataModal scroll modal data
   */
    scrollModal(scrollDataModal: any) {
      this.modalService.open(scrollDataModal, { scrollable: true });
    }

  /**
   * Open modal
   * @param content modal content
   */
   MaryModal(content: any) {
    this.modalService.open(content);
  }

  /**
   * Open small modal
   * @param smallDataModal small modal data
   */
   fullModal(smallDataModal: any) {
    this.modalService.open(smallDataModal, { size: 'fullscreen', windowClass: 'modal-holder' });
  }

  /**
   * Open extra large modal
   * @param exlargeModal extra large modal data
   */
   extraLarge(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'xl', centered: true });
  }

 /**
   * Open Large modal
   * @param largeDataModal large modal data
   */
  largeModal(largeDataModal: any) {
    this.modalService.open(largeDataModal, { size: 'lg', centered: true });
  }

  /**
   * Open small modal
   * @param smallDataModal small modal data
   */
   smallModal(smallDataModal: any) {
    this.modalService.open(smallDataModal, { size: 'sm', centered: true });
  }

  /**
   * Full Sm modal
   * @param smallDataModal small modal data
   */
   fullSMModal(smallDataModal: any) {
    this.modalService.open(smallDataModal, { size: 'sm', centered: true });
  }

  /**
   * Full Md modal
   * @param fullMdDataModal small modal data
   */
   fullMDModal(fullMdDataModal: any) {
    this.modalService.open(fullMdDataModal, { size: 'md', centered: true });
  }

  /**
   * Full Lg modal
   * @param fullMdDataModal small modal data
   */
   fullLGModal(fullMdDataModal: any) {
    this.modalService.open(fullMdDataModal, { size: 'lg', centered: true });
  }

  /**
   * Full Xl modal
   * @param fullXlDataModal small modal data
   */
   fullXLModal(fullXlDataModal: any) {
    this.modalService.open(fullXlDataModal, { size: 'xl', centered: true });
  }

  /**
   * Full XXl modal
   * @param fullXxlDataModal small modal data
   */
   fullXXLModal(fullXxlDataModal: any) {
    this.modalService.open(fullXxlDataModal, { size: 'xxl', centered: true });
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

  /**
   * Open Success modal
   * @param successModal Success modal data
   */
   successModal(successModal: any) {
    this.modalService.open(successModal, { centered: true });
  }

  /**
   * Open Login modal
   * @param loginDataModal Login modal data
   */
   loginModal(loginDataModal: any) {
    this.modalService.open(loginDataModal, { centered: true });
  }

  /**
   * Open subscribe modal
   * @param subscribeDataModal subscribe modal data
   */
   subscribeModal(subscribeDataModal: any) {
    this.modalService.open(subscribeDataModal, { size: 'lg',centered: true });
  }

  /**
   * Open Sign Up modal
   * @param signupDataModal Sign Up modal data
   */
   signupModal(signupDataModal: any) {
    this.modalService.open(signupDataModal, { centered: true });
  }

}
