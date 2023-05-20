import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentManager = this.authService.currentManagerValue;
    if (currentManager && (currentManager.jwt || currentManager.token)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentManager.jwt || currentManager.token}`,
        },
      });
    }

    return next.handle(request);
  }
}
