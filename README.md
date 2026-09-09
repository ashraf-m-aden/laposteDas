# La Poste de Djibouti — Plateforme 1 : Services Clients

Front web Angular (TypeScript / HTML / SCSS) du cahier des charges **Plateforme 1 — Services Clients**
(écosystème numérique La Poste de Djibouti, réalisation D.A.S).

Site **vitrine d'abord** : tout le catalogue de services est consultable sans compte, la connexion
n'intervient qu'au moment de l'acte (confirmation d'envoi, paiement, espace personnel).

Architecture **NgRx** complète (actions, reducers, effects, selectors, state, **facades**),
**notifications toast** pilotées par le store, et **câblage backend prêt** : la couche API est
abstraite derrière des contrats, avec deux implémentations — mock (données factices, mode actuel)
et HTTP (back-end postal .NET).

## Identité visuelle

Reprise de la maquette de marque : **bandeau de navigation jaune** (`--lp-yellow-500 #ffcb05`) avec
texte bleu marine, **héros marine** (`--lp-navy-900 #071f4d` → `--lp-navy-700 #123c86`) sur silhouette
de Djibouti, cartes d'accès rapide blanches en débord du héros, bande de confiance jaune et pied de
page marine liseré jaune. Les jetons sont dans `src/styles/_tokens.scss` (une seule source pour
couleurs, espacements, rayons, ombres) ; les anciens alias `--lp-blue-*` pointent vers la palette
marine pour ne rien casser.

Boutons : `.lp-btn` (marine, action principale sur fond clair), `.lp-btn--accent` (jaune de marque,
appel à l'action), `.lp-btn--secondary` (contour marine), `.lp-btn--outline-light` (contour clair sur
fond marine), `.lp-btn--ghost`.

## Démarrer

```bash
npm install
npm start            # http://localhost:4200 — mode mock (aucun appel réseau)
npm run build        # build de production (mode back-end réel)
```

### Accès public / accès connecté

| Écran | Visiteur | Compte requis |
| --- | --- | --- |
| Accueil, suivi de colis, agences, recherche d'adresse, FAQ | ✅ | — |
| Envoi : formulaire, tarification, récapitulatif | ✅ | Confirmation de l'envoi |
| Affranchissement : catalogue, simulateur de tarif | ✅ | Paiement et étiquette |
| Carnet d'adresses, profil, historique, notifications, tickets | ❌ | Client particulier / entreprise |
| Tableau de bord et tarifs négociés | ❌ | Compte entreprise |

Le visiteur qui atteint un acte protégé garde son dossier : le lien de connexion transporte
`?redirect=`, et l'effect d'authentification le ramène exactement à l'écran quitté.

### Comptes de démonstration (mock)

| Compte | E-mail | Mot de passe |
| --- | --- | --- |
| Client particulier | `client@laposte.dj` | `demo1234` |
| Compte entreprise | `pro@marill.dj` | `demo1234` |

Numéros de suivi factices : `LP123456789DJ` (en livraison), `LP987654321DJ` (livré),
`LP555000111DJ` (incident, zone hors couverture).

## Câblage backend : une seule bascule

`src/environments/environment*.ts`

```ts
useMock: true,                             // true -> données factices ; false -> back-end .NET
apiUrl: 'http://localhost:5000/api/v1',    // racine de l'API du back-end postal
mockLatencyMs: 450,                        // latence simulée du mock
mockErrorRate: 0,                          // ex. 0.2 pour tester les écrans d'erreur
```

* `environment.development.ts` (utilisé par `ng serve`) : **mock activé**.
* `environment.ts` (build de production) : **mock désactivé**, appels HTTP réels.

Le choix se fait dans `src/app/core/api/api.providers.ts` :

```ts
provide: TrackingApi, useClass: environment.useMock ? TrackingMockApi : TrackingHttpApi
```

Rien d'autre ne change : effects, facades et composants consomment les mêmes contrats.

### Couche API

| Fichier | Rôle |
| --- | --- |
| `core/api/api.contracts.ts` | Contrats abstraits (`AuthApi`, `TrackingApi`, `AddressApi`, `AgencyApi`, `ShippingApi`, `PostageApi`, `NotificationApi`, `SupportApi`) — servent de jetons DI |
| `core/api/api.endpoints.ts` | Toutes les URLs du back-end postal, au même endroit |
| `core/api/http/*.http.ts` | Implémentations réelles (HttpClient) |
| `core/api/mock/*.mock.ts` | Implémentations factices (mémoire + latence simulée) |
| `core/mock/*.ts` | Jeu de données factices (adresses Djibouti, colis, agences, catalogue, comptes, tickets, FAQ) |
| `core/interceptors/` | URL de base → jeton d'authentification → normalisation des erreurs en `ApiError` |

Le contrat d'erreur est identique en mock et en HTTP (`{ code, message, status }`), donc les effects
et les toasts d'erreur fonctionnent à l'identique après bascule.

## Fond de carte D.A.S

Les écrans « Agences » n'utilisent plus de fond cartographique tiers : ils
affichent le **référentiel d'adresses D.A.S**, seule source qui fait foi pour
les adresses de Djibouti.

* `shared/components/das-map/` — composant MapLibre (chargé en import dynamique,
  CSS incluse à la demande) : liste des agences avec cadrage automatique, et
  mini-carte sur la fiche agence.
* Le style est **récupéré chez D.A.S**, pas recopié : le composant remplace le
  marqueur `__TILES_BASE_URL__` par l'URL de tuiles de l'environnement.
* Le bouton « Ouvrir dans la carte D.A.S » ouvre la carte vitrine D.A.S centrée
  sur l'agence (`/carte?lat=…&lng=…&marker=…&label=…`).

```ts
map: {
  styleUrl: '/carto/commercial-style.json',  // style MapLibre publié par D.A.S
  tilesUrl: '/tiles',                        // tuiles, relayées par le back-end postal
  viewerUrl: 'https://carte.das.dj/carte',   // carte vitrine D.A.S
}
```

En production, style et tuiles passent par le **back-end postal**, conformément
au chapitre 2 du cahier des charges : la Plateforme 1 ne s'adresse jamais
directement au service D.A.S.

Pour la démonstration locale :

```bash
# 1. tunnel vers la base D.A.S, ouvert sur toutes les interfaces
ssh -L 0.0.0.0:5433:<hote-rds>:5432 <bastion>
# 2. tuiles + carte vitrine (projet das-admin)
docker compose up -d martin      # Martin publié sur :3000
npm start -- --port 4300         # das-admin, carte vitrine sur /carte
# 3. cette application
npm start                        # http://localhost:4200
```

Les coordonnées des adresses factices proviennent du référentiel D.A.S (point
intérieur du quartier réel) : des coordonnées approximatives tombent hors de la
zone couverte et la carte s'affiche vide, sans erreur.

## Architecture NgRx

```
store/                        slices racine (toujours chargées)
  toast/     actions, reducer, effects (auto-fermeture), selectors, facade
  ui/        langue FR/EN, menu mobile, état réseau
  auth/      session, profil, historique, gardes de route
  router/    sélecteurs @ngrx/router-store

features/<domaine>/store/     slice métier chargée avec la route (provideState + provideEffects)
  <domaine>.state.ts | .actions.ts | .reducer.ts | .selectors.ts | .effects.ts | .facade.ts
```

* **Facade obligatoire** : aucun composant n'injecte `Store` directement, il consomme des signaux
  (`toSignal`) exposés par la facade du domaine.
* **Chargement à la demande** : chaque fichier `*.routes.ts` fournit sa slice via
  `provide<Domaine>Store()`, donc reducer + effects arrivent avec le code de la feature.
* `@ngrx/entity` est utilisé là où la collection est indexée (agences, notifications).
* Devtools NgRx actives en développement.

### Domaines couverts (chapitre 6 du cahier des charges)

| Écran(s) | Route | Slice |
| --- | --- | --- |
| 6.1 Accueil | `/` | — |
| 6.2 / 6.3 Suivi de colis (recherche, timeline, introuvable) | `/suivi`, `/suivi/:numero` | `tracking` |
| 6.4 → 6.6 Envoi (adresses, prestation, récapitulatif) | `/envoi`, `/envoi/service`, `/envoi/recapitulatif` | `shipping` + `addresses` |
| 6.7 Recherche d'adresse | `/adresses` | `addresses` |
| 6.8 → 6.10 Affranchissement (catalogue, tarif/paiement, étiquette) | `/affranchissement/...` | `postage` + `addresses` |
| 6.11 → 6.13 Agences (carte, liste, détail) | `/agences`, `/agences/:id` | `agencies` |
| 6.14 Inscription professionnelle | `/compte/inscription` | `auth` |
| 6.15 / 6.16 Espace entreprise (tableau de bord, tarifs négociés) | `/entreprise`, `/entreprise/tarifs` | `shipping` |
| 6.17 Centre de notifications | `/notifications` | `notifications` |
| 6.18 / 6.19 FAQ et demandes support | `/aide`, `/aide/contact` | `support` |
| 6.20 → 6.23 Compte (connexion, profil, historique, carnet d'adresses) | `/compte/...`, `/adresses/carnet` | `auth`, `addresses` |

### Règles transverses (chapitre 8)

* **Adresse = source normalisée unique** : les parcours transactionnels n'acceptent qu'une adresse
  `VALIDATED` renvoyée par le back-end ; une adresse hors zone ou non reconnue bloque l'étape
  suivante et déclenche un toast d'avertissement.
* **États systématiques par écran** : `chargement / vide / erreur / succès` via
  `app-state-panel` et le type `ViewStatus`.
* **Rôles** : `authGuard` et `businessGuard` (visiteur / particulier / entreprise) attendent la
  résolution de la session mémorisée avant de statuer.
* **Responsive** et **accessibilité** : grilles fluides, cibles tactiles ≥ 44 px, lien d'évitement,
  focus visible, `aria-live` sur les toasts.

## Notifications toast

Store dédié (`store/toast`) : `ToastActions.success | error | info | warning | show`,
construction (id, titre par défaut, durée) dans les effects, fermeture automatique annulable,
pile limitée à 4, rendu par `app-toast-container`.

Depuis un composant :

```ts
private readonly toast = inject(ToastFacade);
this.toast.success('Adresse enregistrée.');
```

Depuis un effect métier :

```ts
map(({ error }) => ToastActions.error({ message: error.message }))
```

## Internationalisation

Store `ui` (langue persistée) + `I18nService` + pipe `t` (`{{ 'nav.tracking' | t }}`), dictionnaire
`core/i18n/translations.ts`. **Le socle est en place et la navigation est bilingue FR/EN ; le corps
des pages est encore rédigé en français** — chaque libellé à traduire doit être déplacé vers le
dictionnaire.

## Points ouverts / à faire au branchement réel

* **Carte des agences** : rendu schématique (marqueurs positionnés d'après les coordonnées
  normalisées). À remplacer par Leaflet/Google Maps lors de l'intégration.
* **Paiement** : le prestataire n'est pas arrêté (chapitre 10). L'écran de paiement appelle
  `PostageApi.pay()` ; il faudra y brancher le SDK retenu.
* **Documents (étiquette PDF)** : générés par le back-end ; le mock affiche un aperçu.
* **Pièces jointes des tickets** et **notifications push mobiles** : hors périmètre du mock.
* **Traduction EN** du contenu des pages (voir ci-dessus).
* **Volet e-commerce** : la maquette de communication annonce un axe « E-Commerce Platform »
  (intégration boutiques en ligne), alors que le cahier des charges v2.0 le place explicitement
  hors périmètre (chapitre 9). Il n'est donc pas implémenté ; à trancher avec La Poste de Djibouti
  avant tout développement.
* **Visuels du héros** : illustration vectorielle intégrée (aucun asset externe). À remplacer par
  la photographie de marque au moment de l'intégration graphique définitive.

## Structure

```
src/
  app/
    core/         modèles, couche API (contrats + mock + http), interceptors, i18n, gardes
    store/        slices racine (toast, ui, auth, router) + provideAppStore()
    shared/       composants et pipes réutilisables (toast, état, en-tête de page, formats)
    layout/       en-tête et pied de page
    features/     un dossier par domaine : store/ + pages/ + *.routes.ts
  environments/   bascule mock / back-end réel
  styles/         jetons de design, mixins responsive, base
```
