import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalComponent } from 'src/app/app.constant';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  error = '';
  passwordField!: boolean;
  returnUrl!: string;
  loading = false;
  checkError = false;
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    if (localStorage.getItem(GlobalComponent.CUSTOMER_KEY)) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService
      .login(
        this.loginForm.get('email')!.value,
        this.loginForm.get('password')!.value
      )
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
  }

  togglepasswordField() {
    this.passwordField = !this.passwordField;
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
