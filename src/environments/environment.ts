/**
 * Environnement PRODUCTION (fichier par defaut).
 * `useMock: false` => la couche API tape le vrai back-end postal .NET.
 */
import type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  /** Bascule mock / back-end reel. Unique point de cablage. */
  useMock: false,
  /** Racine de l'API du back-end postal .NET. */
  apiUrl: 'https://api.laposte.dj/postal/v1',
  /** Latence simulee (ms) - utilisee uniquement par la couche mock. */
  mockLatencyMs: 0,
  /** Taux d'erreur simule (0 -> 1) - utilise uniquement par la couche mock. */
  mockErrorRate: 0,
  // En production, style et tuiles sont relayés par le back-end postal : la
  // Plateforme 1 ne s'adresse jamais directement à D.A.S (chapitre 2).
  map: {
    styleUrl: '/carto/commercial-style.json',
    tilesUrl: '/tiles',
    viewerUrl: 'https://carte.das.dj/carte',
  },
  defaultLanguage: 'fr',
  toastDurationMs: 5000,
  storageKeys: {
    token: 'lpd.token',
    language: 'lpd.lang',
    recentTracking: 'lpd.recent-tracking',
  },
};
