/**
 * admin.js
 * ----------------------------------------------------------------
 * Contrairement aux entreprises/vendeurs, il n'y a qu'un seul
 * compte admin, non auto-inscriptible : ses identifiants sont fixes
 * pour l'instant. À remplacer par une vraie authentification côté
 * backend (avec mot de passe haché, jamais en clair dans le code
 * front) dès que possible.
 */
const IDENTIFIANT_ADMIN = 'admin';
const MOT_DE_PASSE_ADMIN = 'comptoir-admin-2026';

export function identifiantsAdminValides(identifiant, motDePasse) {
  return identifiant === IDENTIFIANT_ADMIN && motDePasse === MOT_DE_PASSE_ADMIN;
}