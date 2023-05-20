import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HotToastService } from "@ngneat/hot-toast";
import { finalize, pluck } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-twostep",
  templateUrl: "./twostep.component.html",
  styleUrls: ["./twostep.component.scss"],
})
export class TwoStepComponent implements OnInit {
  year: number = new Date().getFullYear();
  email = "example@abc.com";
  code = "1234";
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "80px",
      height: "50px",
    },
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(pluck("email")).subscribe((params) => {
      this.email = params;
    });
  }

  onOtpChange(code: string) {
    this.code = code;
  }

  sendOtp(): void {
    const toastRef = this.toast.loading(`Sending to ${this.email}...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    this.authService
      .verifyCode(this.email, this.code)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: () => {
          this.router.navigateByUrl("landing/booking");
          this.toast.success("Verify code successfully", {
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

  resendOtp(): void {
    const toastRef = this.toast.loading(`Sending to ${this.email}...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });
    this.authService
      .resendCode(this.email)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.toast.success(res.message + ` to ${this.email}`, {
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
