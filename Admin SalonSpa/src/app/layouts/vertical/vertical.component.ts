import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-vertical",
  templateUrl: "./vertical.component.html",
  styleUrls: ["./vertical.component.scss"],
})
export class VerticalComponent implements OnInit {
  isCondensed = false;

  constructor() {}

  ngOnInit(): void {
    document.documentElement.setAttribute("data-layout", "vertical");
    document.documentElement.setAttribute("data-topbar", "light");
    document.documentElement.setAttribute("data-sidebar", "dark");
    document.documentElement.setAttribute("data-layout-style", "default");
    document.documentElement.setAttribute("data-layout-mode", "light");
    document.documentElement.setAttribute("data-layout-width", "fluid");
    document.documentElement.setAttribute("data-layout-position", "fixed");
    document.documentElement.setAttribute("data-sidebar-image", "none");
    document.documentElement.setAttribute("data-preloader", "disable");

    window.addEventListener("resize", function () {
      if (document.documentElement.clientWidth <= 767) {
        document.documentElement.setAttribute("data-sidebar-size", "");
      } else if (document.documentElement.clientWidth <= 1024) {
        document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (document.documentElement.clientWidth >= 1024) {
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    });
  }

  onToggleMobileMenu() {
    const currentSIdebarSize =
      document.documentElement.getAttribute("data-sidebar-size");
    if (document.documentElement.clientWidth >= 767) {
      if (currentSIdebarSize == null) {
        document.documentElement.getAttribute("data-sidebar-size") == null ||
        document.documentElement.getAttribute("data-sidebar-size") == "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (currentSIdebarSize == "md") {
        document.documentElement.getAttribute("data-sidebar-size") == "md"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "md");
      } else {
        document.documentElement.getAttribute("data-sidebar-size") == "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "lg")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      }
    }

    if (document.documentElement.clientWidth <= 767) {
      document.body.classList.toggle("vertical-sidebar-enable");
    }
    this.isCondensed = !this.isCondensed;
  }

  onSettingsButtonClicked() {
    document.body.classList.toggle("right-bar-enabled");
    const rightBar = document.getElementById("theme-settings-offcanvas");
    if (rightBar != null) {
      rightBar.classList.toggle("show");
      rightBar.setAttribute("style", "visibility: visible;");
    }
  }
}
