import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Marque une requête comme N'ALLANT PAS au back-end postal.
 *
 * ⚠️ Toutes les URL relatives ne visent pas l'API. Le fond de carte D.A.S est
 * servi par notre propre nginx sur `/carto` et `/tiles` — préfixé par
 * `environment.apiUrl`, il partait sur
 * `https://api.laposte.dj/postal/v1/carto/commercial-style.json`, un chemin qui
 * n'a jamais existé nulle part.
 *
 * Un drapeau posé À L'APPEL plutôt qu'une liste de chemins ici : une liste se
 * fait oublier au prochain chemin ajouté, et l'erreur ne se voit qu'à
 * l'exécution, sous la forme d'un 404 sur un domaine qui n'est pas le bon.
 */
export const HORS_API_POSTALE = new HttpContextToken<boolean>(() => false);

/** Raccourci pour le poser : `{ context: horsApiPostale() }`. */
export const horsApiPostale = (): HttpContext =>
  new HttpContext().set(HORS_API_POSTALE, true);

/** Préfixe toute URL relative avec la racine de l'API du back-end postal. */
export const apiUrlInterceptor: HttpInterceptorFn = (request, next) => {
  const isAbsolute = /^https?:\/\//i.test(request.url);
  return isAbsolute || request.context.get(HORS_API_POSTALE)
    ? next(request)
    : next(request.clone({ url: `${environment.apiUrl}${request.url}` }));
};
