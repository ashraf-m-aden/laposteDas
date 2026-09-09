import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** Préfixe toute URL relative avec la racine de l'API du back-end postal. */
export const apiUrlInterceptor: HttpInterceptorFn = (request, next) => {
  const isAbsolute = /^https?:\/\//i.test(request.url);
  return isAbsolute
    ? next(request)
    : next(request.clone({ url: `${environment.apiUrl}${request.url}` }));
};
