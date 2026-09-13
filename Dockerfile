# =============================================================================
# Plateforme 1 — Services Clients (La Poste de Djibouti)
#
# Stage 1 : build Angular (Node LTS)
# Stage 2 : nginx. Il sert la SPA *et* joue le rôle du back-end postal pour le
#           fond de carte : c'est LUI qui présente la clé `X-DAS-Key` à D.A.S.
#
# ⚠️ Le navigateur ne s'adresse jamais directement à D.A.S — règle du chapitre 2
# du cahier des charges, et contrainte technique : MapLibre construit lui-même
# ses URL de tuiles et n'accepte aucun en-tête. La clé reste donc dans la
# configuration du conteneur et **n'entre jamais dans le bundle**.
#
# C'est exactement ce que `proxy.conf.js` fait en développement, sur les mêmes
# chemins (`/carto`, `/tiles`) : un seul câblage front, deux environnements.
# =============================================================================

# ---- Stage 1 : build ---------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

# ⚠️ L'échec classique de cette étape n'est pas un problème de dépendances :
#
#   npm error code ECONNRESET
#   npm error network aborted
#
# C'est un abandon de connexion en plein téléchargement. L'arbre Angular pèse
# quelques centaines de paquets, et la moindre coupure fait tomber le build
# entier après une minute de travail déjà faite. Ces réglages laissent npm
# réessayer au lieu d'abandonner au premier incident.
#
# `NPM_CONFIG_*` plutôt qu'un `npm config set` : même effet, sans couche d'image
# en plus, et visible ici même quand on lit le fichier.
ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
    NPM_CONFIG_FETCH_TIMEOUT=600000

# `--no-audit --no-fund` : deux appels réseau de plus, dont la sortie n'est lue
# par personne dans un build. Autant d'occasions de tomber en moins.
RUN npm ci --no-audit --no-fund

COPY . .

# Configuration `production` : c'est `src/environments/environment.ts` qui est
# retenu — `styleUrl: '/carto/…'` et `tilesUrl: '/tiles'`, tous deux RELATIFS,
# donc servis par le nginx ci-dessous. Rien à réécrire dans le bundle.
RUN npm run build -- --configuration=production

# ---- Stage 2 : runtime -------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Où joindre la pile D.A.S. Par défaut le nom de conteneur `das-admin` sur le
# réseau Docker partagé : La Poste tourne POUR L'INSTANT sur le même EC2 que
# D.A.S, le trafic des tuiles ne sort donc pas de la machine.
#
# Le jour où la Plateforme 1 déménage, une seule variable change :
#   DAS_ORIGIN=https://carte.das.dj  +  DAS_RESOLVER=<DNS joignable>
# (127.0.0.11 est le résolveur interne de Docker : il ne sait résoudre que les
#  noms de conteneurs, pas un nom public.)
#
# ⚠️ `DAS_KEY=""` ne porte AUCUN secret, et n'est pas là par distraction : le
# script d'envsubst ne substitue que les variables RÉELLEMENT présentes dans
# l'environnement. Sans cette déclaration, une image démarrée sans clé garderait
# la chaîne littérale `${DAS_KEY}` dans sa configuration et la présenterait
# telle quelle en en-tête. Déclarée vide, nginx omet l'en-tête et D.A.S rend un
# 401 franc — le comportement documenté. (Le linter Docker s'en inquiète : c'est
# un faux positif, la vraie clé vient de l'environnement du conteneur.)
ENV DAS_ORIGIN=http://das-admin \
    DAS_RESOLVER=127.0.0.11 \
    DAS_KEY=""

# L'image nginx passe `/etc/nginx/templates/*.template` dans `envsubst` au
# démarrage. Le FILTRE est indispensable : sans lui, envsubst remplacerait
# aussi `$host`, `$remote_addr`, `$is_args`… par du vide, et la configuration
# produite serait silencieusement fausse.
ENV NGINX_ENVSUBST_FILTER="^DAS_"

COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist/laposte-services-clients/browser /usr/share/nginx/html

# ⚠️ Le `sed` n'est pas de la superstition : cloné depuis Windows avec
# `core.autocrlf=true`, ce script arrive en CRLF et `sh` répond
# « command not found » sur une ligne qui paraît juste. `.gitattributes` le
# prévient à la source ; ceci le rattrape si quelqu'un l'oublie.
COPY docker/das-check.sh /docker-entrypoint.d/25-das-check.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/25-das-check.sh \
    && chmod +x /docker-entrypoint.d/25-das-check.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
