import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "./toast-service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})

/**
 * Notifications Component
 */
export class NotificationsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  show = true;
  translucent = true;
  stacking = true;
  stackingsecond = true;
  placement = true;
  placementSec = true;

  constructor(
    public toastService: ToastService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Base UI" },
      { label: "Notifications", active: true },
    ];
  }

  /**
   * Standard message
   */
  showStandard() {
    this.toastService.show("Welcome Back! This is a Toast Notification", {
      classname: "bg-primary text-center text-white",
      delay: 10000,
    });
  }

  /**
   * Success message
   */
  showSuccess() {
    this.toastService.show("Your application was successfully sent", {
      classname: "bg-success text-center text-white",
      delay: 10000,
    });
  }

  /**
   * Danger message
   */
  showDanger() {
    this.toastService.show("Error ! An error occurred.", {
      classname: "bg-danger text-center text-white",
      delay: 10000,
    });
  }

  /**
   * Warning message
   */
  showWarning() {
    this.toastService.show("Warning ! Something went wrong try again", {
      classname: "bg-warning text-center text-white",
      delay: 10000,
    });
  }

  /**
   * Show Code Toggle
   */
  ShowCode(event: any) {
    let card = event.target.closest(".card");
    const preview = card.children[1].children[1];
    const codeView = card.children[1].children[2];
    if (codeView != null) {
      codeView.classList.toggle("d-none");
    }
    if (preview != null) {
      preview.classList.toggle("d-none");
    }
  }
}
