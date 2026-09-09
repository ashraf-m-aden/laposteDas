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
  // En développement : das-admin servi par `ng serve` (port 4300) et Martin en
  // local (port 3000). Voir README, section « Fond de carte D.A.S ».
  map: {
    styleUrl: 'http://localhost:4300/assets/commercial-style.json',
    tilesUrl: 'http://localhost:3000',
    viewerUrl: 'http://localhost:4300/carte',
  },
  defaultLanguage: 'fr',
  toastDurationMs: 5000,
  storageKeys: {
    token: 'lpd.token',
    language: 'lpd.lang',
    recentTracking: 'lpd.recent-tracking',
  },
};
