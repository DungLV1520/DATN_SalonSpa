import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  isChecked = false;
  submitted = false;
  submittedPass = false;
  profileData: any;
  isProfile = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

    this.getProfile();
  }

  doCheck() {
    let html = document.getElementsByTagName('html')[0];
    this.isChecked = !this.isChecked;
    if (this.isChecked == true) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  }

  get formProfile() {
    return this.profileForm.controls;
  }

  get formPass() {
    return this.passwordForm.controls;
  }

  editDataGet(item: any): void {
    this.submitted = false;
    this.profileForm.controls['fullname'].setValue(item.fullname);
    this.profileForm.controls['email'].setValue(item.email);
    this.profileForm.controls['phone'].setValue(item.phone);
  }

  saveProfile(): void {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }

    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 10000,
      position: 'top-center',
    });

    this.authService
      .changeProfile(this.profileForm.value)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          if (res.code === 'NEW_EMAIL') {
            const email = this.profileForm.get('email')!.value;
            this.router.navigate(['/verify-profile'], {
              queryParams: { email: email },
            });
          }

          this.toast.success(res.message, {
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

  getProfile(): void {
    this.isProfile = false;
    this.authService
      .getProfile()
      .pipe(finalize(() => (this.isProfile = true)))
      .subscribe({
        next: (res) => {
          this.profileData = res.staff;
          this.editDataGet(this.profileData);
        },
      });
  }

  savePass(): void {
    this.submittedPass = true;

    if (this.passwordForm.invalid) {
      return;
    }

    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: 'top-center',
    });

    this.authService
      .changePassword(this.passwordForm.value)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: () => {
          this.toast.success('Password updated successfully', {
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
