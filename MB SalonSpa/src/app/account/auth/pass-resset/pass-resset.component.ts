import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pass-resset',
  templateUrl: './pass-resset.component.html',
  styleUrls: ['./pass-resset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  passresetForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  checkError = false;
  loading = false;
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.passresetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
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
      position: 'top-center',
    });

    this.loading = true;

    this.authService
      .forgotPassword(this.passresetForm.get('email')!.value)
      .pipe(
        finalize(() => {
          toastRef.close(), (this.loading = false);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/account/create-password']);
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
}
