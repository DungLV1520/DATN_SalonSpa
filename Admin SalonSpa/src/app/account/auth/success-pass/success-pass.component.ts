import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-success-pass",
  templateUrl: "./success-pass.component.html",
  styleUrls: ["./success-pass.component.scss"],
})
export class SuccessPassComponent implements OnInit {
  year: number = new Date().getFullYear();

  constructor() {}

  ngOnInit(): void {}
}
