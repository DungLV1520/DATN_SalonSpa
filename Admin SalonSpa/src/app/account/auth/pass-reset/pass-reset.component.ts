import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { HotToastService } from "@ngneat/hot-toast";
import { finalize } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-pass-reset",
  templateUrl: "./pass-reset.component.html",
  styleUrls: ["./pass-reset.component.scss"],
})
export class PassResetComponent implements OnInit {
  passresetForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.passresetForm = this.formBuilder.group({
      email: ["", [Validators.required]],
    });
  }

  get f() {
    return this.passresetForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.passresetForm.invalid) {
      return;
    }

    const toastRef = this.toast.loading(`Sending to your email...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    this.authService
      .forgotPassword(this.passresetForm.get("email")!.value)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.toast.success(res.message, {
            duration: 3000,
            position: "top-center",
          });
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }
}
