import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Password, User } from "../models/auth.models";
import { GlobalComponent } from "src/app/app.constant";

@Injectable({ providedIn: "root" })
export class AuthService {
  private currentManagerSubject: BehaviorSubject<User>;
  public currentManager: Observable<User>;
  private cachedProfile!: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentManagerSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!)
    );
    this.currentManager = this.currentManagerSubject.asObservable();
  }

  public get currentManagerValue(): User {
    return this.currentManagerSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<User>(GlobalComponent.API_URL_LOCAL + `users/login`, {
        email,
        password,
      })
      .pipe(
        map((user) => {
          if (user && user.jwt) {
            localStorage.setItem(
              GlobalComponent.CUSTOMER_KEY,
              JSON.stringify(user)
            );
            localStorage.setItem(GlobalComponent.TOKEN_KEY, user.jwt);
            this.currentManagerSubject.next(user);
          }
          return user;
        })
      );
  }

  loginFirebase(idToken?: string) {
    return this.http
      .post<User>(GlobalComponent.API_URL_LOCAL + `users/login-firebase`, {
        idToken,
      })
      .pipe(
        map((user) => {
          if (user && user.jwt) {
            localStorage.setItem(
              GlobalComponent.CUSTOMER_KEY,
              JSON.stringify(user)
            );
            localStorage.setItem(GlobalComponent.TOKEN_KEY, user.jwt);
            this.currentManagerSubject.next(user);
          }
          return user;
        })
      );
  }

  verifyCode(email: string, code: string) {
    return this.http
      .post<User>(GlobalComponent.API_URL_LOCAL + `users/verify-code`, {
        email,
        code,
      })
      .pipe(
        map((user) => {
          if (user && (user.jwt || user.token)) {
            localStorage.setItem(
              GlobalComponent.CUSTOMER_KEY,
              JSON.stringify(user)
            );
            this.currentManagerSubject.next(user);
          }
          return user;
        })
      );
  }

  resendCode(email: string) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `users/resend-code`, {
      email,
    });
  }

  forgotPassword(email: string) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `users/forgot`, {
      email,
    });
  }

  resetPassword(req: { token: string; password: string }) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `users/reset`, req);
  }

  logout() {
    localStorage.removeItem(GlobalComponent.CUSTOMER_KEY);
    localStorage.removeItem(GlobalComponent.TOKEN_KEY);
    localStorage.removeItem(GlobalComponent.JWT_KEY);
    this.currentManagerSubject.next(null!);
  }

  register(user: User) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `users`, user);
  }

  changeProfile(user: User) {
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `users/change-profile`,
      user
    );
  }

  changePassword(pass: Password) {
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `users/change-pass`,
      pass
    );
  }

  verifyEmailProfile(res: { code: string; email: string }) {
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `users/verify-otp-profile`,
      res
    );
  }

  resendProfileCode(newEmail: string) {
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `users/resend-otp-profile`,
      { newEmail }
    );
  }

  getProfile(): Observable<any> {
    // TODO: CACH PROFILE OPTIMIZE PERFORMANCE
    // if (this.cachedProfile) {
    //   return this.cachedProfile;
    // }

    this.cachedProfile = this.http
      .get(GlobalComponent.API_URL_LOCAL + `users/profile`)
      .pipe(shareReplay(1));
    return this.cachedProfile;
  }
}
