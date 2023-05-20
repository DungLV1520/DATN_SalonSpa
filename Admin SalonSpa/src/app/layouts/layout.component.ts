import { Component, OnInit } from "@angular/core";
import { EventService } from "../core/services/event.service";
import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from "./layout.model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  layoutType!: string;
  showFooter = false;

  constructor(private eventService: EventService, public router: Router) {}

  ngOnInit(): void {
    this.layoutType = LAYOUT_VERTICAL;
    this.eventService.subscribe("changeLayout", (layout) => {
      this.layoutType = layout;
    });
  }

  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }
}
