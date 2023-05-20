import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-lockscreen",
  templateUrl: "./lockscreen.component.html",
  styleUrls: ["./lockscreen.component.scss"],
})
export class LockScreenComponent implements OnInit {
  lockscreenForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;
  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.lockscreenForm = this.formBuilder.group({
      password: ["", [Validators.required]],
    });
  }

  get f() {
    return this.lockscreenForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.lockscreenForm.invalid) {
      return;
    }
  }
}
