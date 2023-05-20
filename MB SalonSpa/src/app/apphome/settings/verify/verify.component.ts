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

  confirmCode(): void {
    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: 'top-center',
    });

    const objCode = {
      code: this.code.toString(),
      email: this.email,
    };
    this.authService
      .verifyEmailProfile(objCode)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: () => {
          this.toast.success('Verify code email successfully', {
            duration: 3000,
            position: 'top-center',
          });

          this.router.navigate(['/setting']);
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: 'top-center',
          });
        },
      });
  }

  resendOtp(): void {
    const toastRef = this.toast.loading(`Sending to ${this.email}...`, {
      dismissible: true,
      duration: 5000,
      position: 'top-center',
    });
    this.authService
      .resendProfileCode(this.email)
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
