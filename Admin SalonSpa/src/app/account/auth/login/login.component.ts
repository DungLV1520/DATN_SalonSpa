import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HotToastService } from "@ngneat/hot-toast";
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { first } from "rxjs/operators";
import { GlobalComponent, RoleSpa } from "src/app/app.constant";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  year: number = new Date().getFullYear();
  RoleSpa = RoleSpa;
  fieldTextType!: boolean;
  returnUrl!: string;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toast: HotToastService,
    private afAuth: AngularFireAuth
  ) {
    if (this.authService.currentManagerValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem(GlobalComponent.CUSTOMER_KEY)) {
      this.router.navigate(["/"]);
    }

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.f["email"].value, this.f["password"].value)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data.role === RoleSpa.ROLE_USER) {
            this.router.navigate(["/landing/booking"]);
          } else {
            this.router.navigate(["/ecommerce/booking"]);
          }

          this.setTimeLoading();
          this.toast.success("Login successfully", {
            duration: 3000,
            position: "top-right",
          });
        },
        error: (error) => {
          this.setTimeLoading();
          this.toast.error(error, {
            duration: 3000,
            position: "top-right",
          });
        },
      });
  }

  setTimeLoading(): void {
    setTimeout(() => {
      this.submitted = false;
    }, 300);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  navigateRegister(): void {
    this.router.navigateByUrl("/auth/register");
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

        this.authService.loginFirebase(token).subscribe({
          next: (data: any) => {
            if (data.role === RoleSpa.ROLE_USER) {
              this.router.navigate(["/landing/booking"]);
            } else {
              this.router.navigate(["/ecommerce/booking"]);
            }
            this.setTimeLoading();
            this.toast.success("Login successfully", {
              duration: 3000,
              position: "top-right",
            });
          },
          error: (error) => {
            this.setTimeLoading();
            this.toast.error(error, {
              duration: 3000,
              position: "top-right",
            });
          },
        });
      })

      .catch((error) => {
        console.log(error);
      });
  }
}
