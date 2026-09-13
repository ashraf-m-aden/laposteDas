import type { AppEnvironment } from './environment.model';

/**
 * Environnement DÉMONSTRATION — retenu par `ng build --configuration=demo`,
 * c'est celui que l'image Docker embarque aujourd'hui.
 *
 * Il existe pour une seule raison : le back-end postal .NET n'est pas encore
 * là. `api.laposte.dj` ne résout pas, et une image construite en `production`
 * rend « Connexion au service postal impossible » sur tout ce qui n'est pas la
 * carte — l'intercepteur d'erreurs traduit ainsi un `status === 0`.
 *
 * ⚠️ **Ce n'est pas `development` optimisé.** Il en diffère sur deux points qui
 * comptent une fois déployé :
 *   - `production: true` — Angular en mode production, pas de vérifications de
 *     développement ni de messages destinés au débogage dans la console ;
 *   - `viewerUrl` vise la vraie carte vitrine, pas `http://localhost/carte` :
 *     un visiteur distant n'a pas de D.A.S sur SA machine, et le bouton
 *     « Ouvrir dans la carte D.A.S » ouvrirait une page morte.
 *
 * ⚠️ `useMock: true` veut dire que les colis, les comptes et les tarifs
 * affichés sont **inventés**. Le bandeau de `app.html` et la ligne du pied de
 * page le disent à l'écran : ne pas les retirer sans retirer ce fichier aussi.
 *
 * À SUPPRIMER le jour où le back-end postal répond — cette configuration n'a
 * plus de raison d'être, et `production` reprend sa place dans le Dockerfile.
 */
export const environment: AppEnvironment = {
  production: true,
  useMock: true,
  /**
   * Jamais appelé — `provideApiLayer()` branche la couche factice. Il reste la
   * VRAIE cible pour que le bandeau du pied de page annonce le bon back-end
   * plutôt qu'un `localhost` qui ne veut rien dire pour un visiteur.
   */
  apiUrl: 'https://api.laposte.dj/postal/v1',
  mockLatencyMs: 250,
  mockErrorRate: 0,
  // Relatifs, comme en production : c'est le nginx de l'image qui les sert et
  // qui présente la clé D.A.S. La carte, elle, montre de VRAIES données.
  map: {
    styleUrl: '/carto/commercial-style.json',
    tilesUrl: '/tiles',
    // Vide : deduit de l'origine courante — voir `environment.model.ts`.
    viewerUrl: '',
  },
  defaultLanguage: 'fr',
  toastDurationMs: 5000,
  storageKeys: {
    token: 'lpd.token',
    language: 'lpd.lang',
    recentTracking: 'lpd.recent-tracking',
  },
};
