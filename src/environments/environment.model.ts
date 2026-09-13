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
   *
   *   ⚠️ **Vide = déduire de l'origine courante** : `<protocole>//<hôte>/carte`,
   *   SANS le port. C'est le cas normal tant que D.A.S et la Plateforme 1
   *   partagent une machine — D.A.S y répond sur le port 80, nous sur 8080.
   *   Déduire évite d'écrire une adresse que personne ne peut joindre : le
   *   domaine `das.dj` N'EXISTE PAS ENCORE (aucun enregistrement DNS au
   *   2026-09-13), et `localhost` ne veut rien dire pour un visiteur distant.
   *   Ne renseigner ce champ que le jour où D.A.S a une adresse à lui, sur un
   *   autre hôte que le nôtre.
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
