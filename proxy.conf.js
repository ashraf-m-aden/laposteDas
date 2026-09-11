/**
 * Relais de DÉVELOPPEMENT vers D.A.S.
 *
 * ── Pourquoi un proxy, et pourquoi en .js ───────────────────────────────────
 * En production, style et tuiles passent par le back-end postal (chapitre 2 du
 * cahier des charges) : c'est LUI qui présente l'en-tête `X-DAS-Key`, parce que
 * le navigateur ne le peut pas — MapLibre construit lui-même ses URL de tuiles
 * et n'accepte aucun en-tête.
 *
 * En développement, le back-end postal ne tourne pas toujours. Ce proxy joue
 * son rôle : il pose le même en-tête, sur les mêmes chemins. Le front utilise
 * donc `/carto` et `/tiles` dans les deux environnements — un seul câblage — et
 * **la clé n'entre jamais dans le bundle livré au navigateur**.
 *
 * En `.js` et non en `.json` pour une seule raison : un fichier JSON ne peut pas
 * lire une variable d'environnement, et la clé s'y retrouverait écrite en dur,
 * donc committée.
 *
 * ── Utilisation ─────────────────────────────────────────────────────────────
 *
 *   # PowerShell
 *   $env:DAS_KEY = "das_XXXXXXXX.…"   ; npm start
 *
 *   # bash
 *   DAS_KEY="das_XXXXXXXX.…" npm start
 *
 * Sans `DAS_KEY`, le style se charge mais les tuiles répondent 401 et la carte
 * reste vide. Un avertissement le dit au démarrage plutôt que de laisser
 * chercher.
 *
 * ⚠️ Demandez une clé de RECETTE à D.A.S, distincte de celle de production.
 */

// L'hôte de la pile D.A.S. `http://localhost` = nginx du dépôt das-admin, qui
// sert le style et relaie l'API. `https://carte.das.dj` pour taper la recette.
const DAS = process.env.DAS_URL || 'http://localhost';
const CLE = process.env.DAS_KEY || '';

if (!CLE) {
  console.warn(
    '\n⚠️  DAS_KEY absente : les tuiles D.A.S répondront 401 et la carte restera vide.' +
      '\n   Posez la variable avant `npm start` — voir proxy.conf.js.\n',
  );
}

module.exports = {
  // Le style. Aucune clé : il ne contient pas de donnée, seulement la façon de
  // la dessiner. `/carto` est le chemin que D.A.S publie pour nous.
  '/carto': {
    target: DAS,
    changeOrigin: true,
    secure: false,
  },

  // Les tuiles. `/tiles` est notre chemin historique — celui que le back-end
  // postal exposera — et il est réécrit vers le relais public de D.A.S.
  //
  // ⚠️ L'ancien `/tiles` de D.A.S rend `410 Gone` depuis le 2026-09-10 : viser
  // `${DAS}/tiles` directement ne marcherait plus. La réécriture n'est pas une
  // commodité, c'est le nouveau chemin.
  '/tiles': {
    target: DAS,
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/tiles': '/api/public/tiles' },
    headers: CLE ? { 'X-DAS-Key': CLE } : {},
  },
};
