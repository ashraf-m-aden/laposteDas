#!/bin/sh
# =============================================================================
# Dit au démarrage où ce conteneur va chercher le fond de carte, et signale la
# clé manquante AVANT qu'on cherche pourquoi la carte est blanche.
#
# Lancé par l'entrypoint de l'image nginx, APRÈS la substitution du modèle
# (`20-envsubst-on-templates.sh`) — d'où le préfixe `25-`.
# =============================================================================
set -e

echo "[das] origine des tuiles et du style : ${DAS_ORIGIN:-http://das-admin}"

if [ -z "${DAS_KEY:-}" ]; then
    echo "[das] ⚠️  DAS_KEY absente. Le style se chargera, les tuiles rendront 401"
    echo "[das]     et la carte restera vide. Poser la clé dans .env (DAS_KEY=das_…)."
else
    # Le PRÉFIXE identifie la clé sans la révéler : c'est ce qui figure dans les
    # échanges avec D.A.S. Le secret, lui, ne doit apparaître dans aucun journal.
    echo "[das] clé présentée, préfixe ${DAS_KEY%%.*}"
fi
