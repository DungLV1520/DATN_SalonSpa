import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HotToastService } from "@ngneat/hot-toast";
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { first } from "rxjs/operators";
import { RoleSpa } from "src/app/app.constant";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  signupForm!: UntypedFormGroup;
  submitted = false;
  successmsg = false;
  type!: string;
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private toast: HotToastService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      fullname: ["", [Validators.required]],
      password: ["", Validators.required],
      phone: ["", Validators.required],
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

    this.signupForm.value["gender"] = "Male";
    this.signupForm.value["phone"] = this.signupForm.value["phone"].toString();
    this.authService
      .register(this.signupForm.value)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          this.setTimeLoading();
          this.router.navigate(["/auth/twostep"], {
            queryParams: { email: res?.data?.email },
          });
          this.toast.success("Register successful !!!", {
            duration: 3000,
            position: "top-right",
          });
        },
        error: (error: any) => {
          setTimeout(() => {
            this.submitted = false;
          }, 300);

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
    }, 500);
  }

  navigateLogin(): void {
    this.router.navigate(["/auth/login"]);
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

            this.toast.success("Register successfully", {
              duration: 3000,
              position: "top-right",
            });
          },
          error: (error) => {
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
