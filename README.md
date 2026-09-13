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

En développement le back-end postal ne tourne pas toujours, et `proxy.conf.js`
joue alors son rôle : il pose le même en-tête `X-DAS-Key`, sur les mêmes
chemins. Le front utilise donc `/carto` et `/tiles` dans les deux
environnements — un seul câblage — et **la clé n'entre jamais dans le bundle
livré au navigateur**.

### ⚠️ La clé D.A.S — à câbler côté back-end

Depuis le **2026-09-10**, D.A.S a fermé son relais de tuiles ouvert. Les tuiles
passent par un relais authentifié, à liste blanche de cinq sources :

| | |
| --- | --- |
| Avant | `https://carte.das.dj/tiles/{source}/{z}/{x}/{y}` — sans authentification |
| Maintenant | `https://carte.das.dj/api/public/tiles/{source}/{z}/{x}/{y}` + en-tête `X-DAS-Key` |

L'ancien chemin rend **`410 Gone`**. Ce n'est pas une panne et il ne sera pas
rouvert.

**C'est le back-end postal qui présente la clé**, et lui seul : le navigateur ne
le peut pas — MapLibre construit lui-même ses URL de tuiles et n'accepte aucun
en-tête. La clé reste donc dans la configuration serveur (variable
d'environnement ou `appsettings`), **jamais** dans le code livré au client.

Le relais doit aussi laisser passer `204` tel quel : une tuile vide est la
réponse normale de la grande majorité des tuiles d'un niveau de zoom, et la
traiter comme une erreur ferait clignoter des alertes sur une carte qui marche.

> **Tant que cette clé n'est pas câblée**, les tuiles répondent `401` et la carte
> reste vide — en dev comme en production. Une clé de **recette**, distincte de
> celle de production, se demande à l'équipe D.A.S.

Le style, lui, ne demande aucune clé : il ne contient pas de donnée, seulement la
façon de la dessiner. Il est publié en trois langues —
`commercial-style.json` (français, nom figé), `.en.json`, `.ar.json`.

### Démonstration locale

```bash
# 1. la pile D.A.S (style, tuiles sous clé, et carte vitrine sur /carte)
#    ⚠️ Martin ne publie plus AUCUN port : il n'existe que sur le réseau
#    interne de la composition Docker. Tout passe par l'API.
docker compose up -d             # dans le dépôt das-admin, sert sur :80

# 2. cette application — la clé D.A.S vient du .env
cp .env.example .env             # puis y poser DAS_KEY
npm start                        # http://localhost:4200
```

> ⚠️ **Node ne lit pas les `.env` de lui-même.** C'est `proxy.conf.js` qui le
> charge explicitement, au démarrage du serveur de dev. Une variable déjà posée
> dans l'environnement l'emporte sur le fichier — pratique sur une machine de
> build, qui n'a pas de `.env`.
>
> `.env` est **ignoré par git**. Une clé committée est une clé publiée, et tout
> l'intérêt d'une clé révocable est de savoir qui la détient.

Le back-end postal n'est **pas** nécessaire pour travailler sur la carte : le
proxy le remplace. Il le redevient dès qu'on touche au reste de l'API.

> Sans `DAS_KEY`, le style se charge mais les tuiles répondent `401` et la carte
> reste vide. Le serveur de dev l'avertit au démarrage.

Vérifié le 2026-09-11 sur la pile locale, en rejouant ce que le proxy traduit :

| Requête du front | Réponse |
| --- | --- |
| `/carto/commercial-style.json` | `200` |
| `/tiles/quartiers_tiles/13/…` | `200` |
| `/tiles/blocs_tiles/13/…` | `200` |
| `/tiles/contour_national/8/…` | `200` |
| `/tiles/cities_labels_tiles/13/…` | `204` — tuile vide, **légitime** |
| `/tiles/contour_national/13/…` | `404` — **hors plage de zoom** (déclarée z0–12), pas un refus |

> ⚠️ Un `404` ne veut pas forcément dire « source interdite ». Chaque source a sa
> fenêtre de zoom : `contour_national` s'arrête à z12, `adresses_tiles` commence
> à z15. Hors de leur plage elles rendent `404`, exactement comme une source
> inconnue. C'est normal et MapLibre s'en accommode — il ne demande une tuile que
> dans la plage déclarée par le style.

Les coordonnées des adresses factices proviennent du référentiel D.A.S (point
intérieur du quartier réel) : des coordonnées approximatives tombent hors de la
zone couverte et la carte s'affiche vide, sans erreur.

## Déploiement en conteneur

```bash
cp .env.example .env             # puis y poser DAS_KEY
docker compose up -d --build     # http://<hôte>:8080
```

Trois fichiers : `Dockerfile` (build Angular, puis nginx), `docker/nginx/
default.conf.template` (la configuration) et `docker-compose.yml`.

### Le nginx de l'image tient le rôle du back-end postal

Tant que le back-end postal .NET ne relaie pas le fond de carte, **c'est ce
nginx qui présente la clé** — sur les mêmes chemins que `proxy.conf.js` en
développement :

| Chemin | Vers | Clé |
| --- | --- | --- |
| `/carto/…` | `${DAS_ORIGIN}/carto/…` | non — le style ne contient pas de donnée |
| `/tiles/<source>/<z>/<x>/<y>` | `${DAS_ORIGIN}/api/public/tiles/…` | **oui**, en-tête `X-DAS-Key` |
| tout le reste | la SPA (repli `index.html`) | — |

La règle du chapitre 2 tient toujours : **le navigateur ne s'adresse jamais
directement à D.A.S**, et la clé reste dans la configuration du conteneur — elle
n'entre ni dans le bundle, ni dans l'image.

Le jour où le back-end .NET reprend ce relais, ces deux `location` disparaissent
d'ici sans rien changer au front : les chemins sont les mêmes.

### ⚠️ Même EC2 que D.A.S — pour l'instant

La Plateforme 1 tourne sur la **même machine** que la pile D.A.S et rejoint son
réseau Docker `das-shared`. Son relais joint donc D.A.S **par nom de
conteneur** : le trafic des tuiles ne sort pas de l'hôte.

| Variable | Défaut | Rôle |
| --- | --- | --- |
| `DAS_ORIGIN` | `http://das-admin` | où joindre la pile D.A.S |
| `DAS_RESOLVER` | `127.0.0.11` | résolveur DNS interne de Docker |
| `DAS_KEY` | *(vide)* | la clé, présentée par le relais |

Quand elle déménagera, **une seule ligne change** — `DAS_ORIGIN=https://carte.das.dj`
— plus `DAS_RESOLVER`, parce que `127.0.0.11` ne sait résoudre que des noms de
conteneurs, pas un nom public.

> Le port est **8080** et non 80 : `das-admin` tient déjà le 80 sur cet hôte.

> Sans `DAS_KEY`, le conteneur l'annonce au démarrage (`[das] ⚠️ DAS_KEY
> absente`), le style se charge et les tuiles rendent `401`.

Vérifié le 2026-09-13, conteneur sur `das-shared` avec la clé `das_paQjiHPR`,
en rejouant ce que le relais traduit :

| Requête | Réponse |
| --- | --- |
| `/` et toute route SPA | `200` |
| `/carto/commercial-style.json` | `200`, 24 Ko |
| `/tiles/quartiers_tiles/13/5077/3830` | `200`, 14 Ko |
| `/tiles/streets_tiles/13/5077/3830` | `200`, 117 Ko |
| `/tiles/adresses_tiles/16/40620/30645` | `200`, 63 Ko |
| `/tiles/poi_sites_tiles/13/5077/3830` | `200`, 8 Ko |
| `/tiles/cities_labels_tiles/13/5077/3830` | `204` — tuile vide, **légitime** |
| `/tiles/Surveys/…` — hors liste blanche | `404` |
| `/tiles/…` sans `DAS_KEY` | `401` |

> Les réponses par le relais sont **identiques** à celles obtenues en tapant
> `das-admin` en direct avec la même clé, code par code. Le relais ne
> réinterprète rien.

### ⚠️ Le fond de carte rend `404` — ce n'est pas ce relais

Les **cinq sources de fond** annoncées ouvertes le 2026-09-11 par la note
d'intégration D.A.S rendent toutes `404` sur `/api/public/tiles`, mesuré le
2026-09-13 :

| Source | `/api/public/tiles` (clé) | `/api/tiles` (jeton admin) |
| --- | --- | --- |
| `contour_national` z8 | `404` | **`200`, 8 Ko** |
| `blocs_tiles` z13 | `404` | **`200`, 323 Ko** |
| `cities_tiles`, `route_principaux`, `voierie_secondaire` | `404` | — |

La donnée existe, Martin la publie, le relais **admin** la sert. C'est la liste
blanche du relais **public** qui est restée à cinq sources, celles du
référentiel. Rien à corriger ici ni dans le style : tant que le back D.A.S n'a
pas élargi cette liste, la carte n'aura **ni mer, ni routes au dézoom, ni
texture de bâti**.

> C'est exactement le symptôme que la note d'intégration attribue à un style
> périmé. Ici le style est à jour — l'écart est côté D.A.S.

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
