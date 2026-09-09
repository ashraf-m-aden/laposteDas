import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { ApiError } from '../models';

/** Normalise toute erreur HTTP en `ApiError`, format unique consommé par les effects. */
export const errorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((response: HttpErrorResponse) => {
      const apiError: ApiError = {
        code: response.error?.code ?? `HTTP_${response.status}`,
        message:
          response.error?.message ??
          (response.status === 0
            ? 'Connexion au service postal impossible.'
            : 'Une erreur est survenue, merci de réessayer.'),
        status: response.status,
        details: response.error?.details,
      };
      return throwError(() => apiError);
    }),
  );
