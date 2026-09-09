import type { Language } from '../app/core/models';

/**
 * Contrat d'environnement partagé par tous les fichiers d'environnement.
 * Défini à part : `fileReplacements` remplace `environment.ts` au build de dev.
 */
export interface AppEnvironment {
  production: boolean;
  /** Bascule mock / back-end réel. Unique point de câblage. */
  useMock: boolean;
  /** Racine de l'API du back-end postal .NET. */
  apiUrl: string;
  /**
   * Fond de carte D.A.S consommé par les écrans « Agences ».
   * `styleUrl` : style MapLibre publié par D.A.S (contient le marqueur
   *   `__TILES_BASE_URL__`, résolu à l'exécution avec `tilesUrl`).
   * `tilesUrl` : service de tuiles. En production il pointe sur le back-end
   *   postal, qui relaie D.A.S — la Plateforme 1 ne s'adresse jamais
   *   directement au service D.A.S (règle d'architecture, chapitre 2).
   * `viewerUrl` : carte vitrine D.A.S, pour l'ouverture en plein écran.
   */
  map: {
    styleUrl: string;
    tilesUrl: string;
    viewerUrl: string;
  };
  /** Latence simulée (ms), utilisée uniquement par la couche mock. */
  mockLatencyMs: number;
  /** Taux d'erreur simulé (0 -> 1), utilisé uniquement par la couche mock. */
  mockErrorRate: number;
  defaultLanguage: Language;
  toastDurationMs: number;
  storageKeys: {
    token: string;
    language: string;
    recentTracking: string;
  };
}
