import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../services';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Get the auth token from the service.
    const user = this.authService.currentUser.value;

    if (user) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${user.token}`)
      });
      // send cloned request with header to the next handler.
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }

  }
}
