import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { User } from "../models/auth.models";
import { RoleSpa } from "src/app/app.constant";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (
          err.error.statusCode === 401 ||
          err.error.message === "jwt expired"
        ) {
          this.authenticationService.logout();
          const currentManager: User =
            this.authenticationService.currentManagerValue;

          if (currentManager?.role === RoleSpa.ROLE_USER) {
            this.router.navigate(["/landing/booking"]);
          } else {
            this.router.navigate(["/auth/login"]);
          }
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
