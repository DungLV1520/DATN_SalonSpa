import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authservice: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this.authservice.currentUserValue;
    if (currentUser && (currentUser.token || currentUser.jwt)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token || currentUser.jwt}`,
        },
      });
    }

    return next.handle(request);
  }
}
