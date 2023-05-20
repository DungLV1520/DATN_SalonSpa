import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { finalize, pluck } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-pass-create',
  templateUrl: './pass-create.component.html',
  styleUrls: ['./pass-create.component.scss'],
})
export class PasswordCreateComponent implements OnInit {
  year: number = new Date().getFullYear();
  passresetForm!: FormGroup;
  passwordControl!: FormControl;
  cpasswordControl!: FormControl;
  submitted!: boolean;
  passwordField!: boolean;
  confirmField!: boolean;
  check = false;
  error = '';
  checkError = false;
  loading = false;
  resetToken!: string;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(pluck('token')).subscribe((params) => {
      this.resetToken = params;
    });

    this.passwordControl = new FormControl('', [Validators.required]);
    this.cpasswordControl = new FormControl('', [Validators.required]);
    this.passresetForm = this.formBuilder.group(
      {
        password: this.passwordControl,
        cpassword: this.cpasswordControl,
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')!.value;
    const cpassword = group.get('cpassword')!.value;
    return password === cpassword ? null : { passwordNotMatch: true };
  }

  get f() {
    return this.passresetForm.controls;
  }

  checkPassword(): boolean {
    return (
      this.passresetForm.get('password')!.value ===
      this.passresetForm.get('cpassword')!.value
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.passresetForm.invalid || !this.checkPassword()) {
      return;
    }

    if (!this.resetToken) {
      this.toast.info(
        `You do not have a token to reset your password. Please check the reset link in your email.`,
        {
          dismissible: true,
          duration: 5000,
          position: 'top-center',
        }
      );

      return;
    }

    const toastRef = this.toast.loading(`Reseting password...`, {
      dismissible: true,
      duration: 5000,
      position: 'top-center',
    });

    this.loading = true;

    const objPassReset = {
      token: this.resetToken,
      password: this.passresetForm.get('password')!.value,
    };

    this.authService
      .resetPassword(objPassReset)
      .pipe(
        finalize(() => {
          toastRef.close(), (this.loading = false);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/account/thankyou']);
        },
        error: (error) => {
          this.checkError = true;
          this.error = error;
          setTimeout(() => {
            this.checkError = false;
          }, 5000);
        },
      });
  }

  togglepasswordField() {
    this.passwordField = !this.passwordField;
  }

  toggleconfirmField() {
    this.confirmField = !this.confirmField;
  }
}
