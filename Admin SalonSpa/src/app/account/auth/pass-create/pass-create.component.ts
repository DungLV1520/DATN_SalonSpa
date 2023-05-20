import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HotToastService } from "@ngneat/hot-toast";
import { finalize, pluck } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-pass-create",
  templateUrl: "./pass-create.component.html",
  styleUrls: ["./pass-create.component.scss"],
})
export class PassCreateComponent implements OnInit {
  passresetForm!: UntypedFormGroup;
  passwordControl!: FormControl;
  cpasswordControl!: FormControl;
  submitted = false;
  passwordField!: boolean;
  confirmField!: boolean;
  error = "";
  returnUrl!: string;
  year: number = new Date().getFullYear();
  token!: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(pluck("token")).subscribe((params) => {
      this.token = params;
    });

    this.passwordControl = new FormControl("", [Validators.required]);
    this.cpasswordControl = new FormControl("", [Validators.required]);
    this.passresetForm = this.formBuilder.group(
      {
        password: this.passwordControl,
        cpassword: this.cpasswordControl,
      },
      { validator: this.checkPasswords }
    );

    const myInput = document.getElementById(
      "password-input"
    ) as HTMLInputElement;
    const letter = document.getElementById("pass-lower");
    const capital = document.getElementById("pass-upper");
    const number = document.getElementById("pass-number");
    const length = document.getElementById("pass-length");

    // When the user clicks on the password field, show the message box
    myInput.onfocus = function () {
      let input = document.getElementById("password-contain") as HTMLElement;
      input.style.display = "block";
    };

    // When the user clicks outside of the password field, hide the password-contain box
    myInput.onblur = function () {
      let input = document.getElementById("password-contain") as HTMLElement;
      input.style.display = "none";
    };

    // When the user starts to type something inside the password field
    myInput.onkeyup = function () {
      // Validate lowercase letters
      var lowerCaseLetters = /[a-z]/g;
      if (myInput.value.match(lowerCaseLetters)) {
        letter?.classList.remove("invalid");
        letter?.classList.add("valid");
      } else {
        letter?.classList.remove("valid");
        letter?.classList.add("invalid");
      }

      // Validate capital letters
      var upperCaseLetters = /[A-Z]/g;
      if (myInput.value.match(upperCaseLetters)) {
        capital?.classList.remove("invalid");
        capital?.classList.add("valid");
      } else {
        capital?.classList.remove("valid");
        capital?.classList.add("invalid");
      }

      // Validate numbers
      var numbers = /[0-9]/g;
      if (myInput.value.match(numbers)) {
        number?.classList.remove("invalid");
        number?.classList.add("valid");
      } else {
        number?.classList.remove("valid");
        number?.classList.add("invalid");
      }

      // Validate length
      if (myInput.value.length >= 8) {
        length?.classList.remove("invalid");
        length?.classList.add("valid");
      } else {
        length?.classList.remove("valid");
        length?.classList.add("invalid");
      }
    };
  }

  checkPasswords(group: FormGroup) {
    const password = group.get("password")!.value;
    const cpassword = group.get("cpassword")!.value;
    return password === cpassword ? null : { passwordNotMatch: true };
  }

  get f() {
    return this.passresetForm.controls;
  }

  checkPassword(): boolean {
    return (
      this.passresetForm.get("password")!.value ===
      this.passresetForm.get("cpassword")!.value
    );
  }

  onSubmit() {
    this.submitted = true;

    if (this.passresetForm.invalid || !this.checkPassword()) {
      return;
    }

    const toastRef = this.toast.loading(`Reseting password...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    const objPassReset = {
      token: this.token,
      password: this.passresetForm.get("password")!.value,
    };
    this.authService
      .resetPassword(objPassReset)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.router.navigateByUrl("/auth/success-pass");
          this.toast.success(res.message, {
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

  togglepasswordField() {
    this.passwordField = !this.passwordField;
  }

  toggleconfirmField() {
    this.confirmField = !this.confirmField;
  }
}
