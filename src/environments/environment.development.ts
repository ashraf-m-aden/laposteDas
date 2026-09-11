import type { AppEnvironment } from './environment.model';

/**
 * Environnement DEV - remplace automatiquement par `fileReplacements` (angular.json).
 * `useMock: true` => aucune requete reseau, la couche API sert des donnees factices.
 * Passer `useMock` a false suffit pour brancher le back-end postal .NET reel.
 */
export const environment: AppEnvironment = {
  production: false,
  useMock: true,
  apiUrl: 'http://localhost:5000/api/v1',
  mockLatencyMs: 450,
  mockErrorRate: 0,
  // ⚠️ **Chemins RELATIFS, exactement ceux de la production.** `proxy.conf.json` les renvoie
  // vers le back-end postal local ; en production c'est nginx qui le fait. Un seul câblage, et le
  // mode dev répète le vrai geste — y compris « on a perdu la clé, on en redemande une ».
  //
  // Ce que cette configuration NE fait plus, et pourquoi :
  //   - elle ne tape plus D.A.S en direct. Depuis le 2026-09-10 le relais direct vers Martin est
  //     fermé : `http://<hôte>/tiles/…` rend **410 Gone**, définitivement. Les tuiles passent par
  //     `/api/public/tiles`, sous clé révocable.
  //   - elle ne porte pas la clé. Une clé posée ici partirait dans le bundle livré au navigateur.
  //     C'est le back-end postal qui présente l'en-tête `X-DAS-Key` — le navigateur ne peut pas :
  //     MapLibre construit lui-même ses URL de tuiles et n'accepte aucun en-tête.
  //
  // ⚠️ Tant que le back-end postal ne présente pas la clé, les tuiles répondent 401 et la carte
  // reste vide. Voir README, « Fond de carte D.A.S ».
  map: {
    styleUrl: '/carto/commercial-style.json',
    tilesUrl: '/tiles',
    // La carte vitrine D.A.S, elle, s'ouvre en direct : page publique, elle porte sa propre clé
    // et n'en demande aucune à l'appelant.
    viewerUrl: 'http://localhost/carte',
  },
  defaultLanguage: 'fr',
  toastDurationMs: 5000,
  storageKeys: {
    token: 'lpd.token',
    language: 'lpd.lang',
    recentTracking: 'lpd.recent-tracking',
  },
};
