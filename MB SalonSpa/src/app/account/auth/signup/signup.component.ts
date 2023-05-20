import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  checkError = false;
  error = '';
  loading = false;
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', [Validators.required]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.signupForm.value['gender'] = 'Male';
    this.signupForm.value['phone'] = this.signupForm.value['phone'].toString();
    this.authService
      .register(this.signupForm.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.router.navigate(['/account/verify'], {
            queryParams: { email: res?.data?.email },
          });
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

  googleAuth() {
    return this.authLogin(new GoogleAuthProvider());
  }

  githubAuth() {
    return this.authLogin(new GithubAuthProvider());
  }

  facebookAuth() {
    return this.authLogin(new FacebookAuthProvider());
  }

  twiterAuth() {
    return this.authLogin(new TwitterAuthProvider());
  }

  authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result: any) => {
        const token = result.user._delegate.accessToken;
        this.loading = true;
        this.authService
          .loginFirebase(token)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: () => {
              this.router.navigate(['/home']);
            },
            error: (error) => {
              this.checkError = true;
              this.error = error;
              setTimeout(() => {
                this.checkError = false;
              }, 5000);
            },
          });
      })

      .catch((error: any) => {
        console.log(error);
      });
  }
}
