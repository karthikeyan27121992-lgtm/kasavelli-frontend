import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(addToken(req, authService.getToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only attempt refresh on 401, when a refresh token exists,
      // and never for the refresh endpoint itself (prevents infinite loop)
      const isRefreshUrl = req.url.includes('/token/refresh/');
      if (error.status === 401 && !isRefreshUrl && authService.getRefreshToken()) {
        return authService.refreshToken().pipe(
          switchMap((newToken: string) => {
            // Retry the original request with the new access token
            return next(addToken(req, newToken));
          }),
          catchError((refreshError) => {
            // Refresh also failed — log out and propagate the error
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) return req;
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
}

// Made with Bob
