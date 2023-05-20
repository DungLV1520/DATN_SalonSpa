import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, pluck } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  year: number = new Date().getFullYear();
  email = 'example@abc.com';
  code!: string;
  checkError = false;
  error = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(pluck('email')).subscribe((params) => {
      this.email = params;
    });
  }

  onOtpChange(code: string) {
    this.code = code;
  }

  sendOtp(): void {
    this.loading = true;
    this.authService
      .verifyCode(this.email, this.code.toString())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.error = error;
          this.checkError = true;
          setTimeout(() => {
            this.checkError = false;
          }, 5000);
        },
      });
  }

  resendOtp(): void {
    if (!this.email) {
      return;
    }

    const toastRef = this.toast.loading(`Sending to ${this.email}...`, {
      dismissible: true,
      duration: 5000,
      position: 'top-center',
    });

    this.authService
      .resendCode(this.email)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.toast.success(res.message + ` to ${this.email}`, {
            duration: 3000,
            position: 'top-center',
          });
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: 'top-center',
          });
        },
      });
  }
}
