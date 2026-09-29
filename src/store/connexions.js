/**
 * connexions.js
 * ----------------------------------------------------------------
 * Suit qui est EN LIGNE (un vendeur reste "en ligne" tant qu'il ne
 * s'est pas explicitement déconnecté — pas de vraie détection de
 * fermeture de fenêtre sans backend/websocket, limite acceptée
 * pour l'instant) et garde l'historique de chaque connexion/
 * déconnexion, par entreprise.
 */
import { reactive } from 'vue';

const enLigne = reactive({});
const historique = reactive([]);

function dateHeureActuelles() {
  const maintenant = new Date();
  const date = String(maintenant.getDate()).padStart(2, '0') + '/' + String(maintenant.getMonth() + 1).padStart(2, '0');
  const heure = String(maintenant.getHours()).padStart(2, '0') + ':' + String(maintenant.getMinutes()).padStart(2, '0');
  return { date, heure };
}

export function enregistrerConnexionVendeur(entreprise, nomVendeur) {
  if (!enLigne[entreprise]) enLigne[entreprise] = {};
  enLigne[entreprise][nomVendeur] = true;

  const { date, heure } = dateHeureActuelles();
  historique.unshift({ entreprise, nomVendeur, type: 'connexion', date, heure });
}

export function enregistrerDeconnexionVendeur(entreprise, nomVendeur) {
  if (enLigne[entreprise]) enLigne[entreprise][nomVendeur] = false;

  const { date, heure } = dateHeureActuelles();
  historique.unshift({ entreprise, nomVendeur, type: 'deconnexion', date, heure });
}

export function vendeurEstEnLigne(entreprise, nomVendeur) {
  return !!(enLigne[entreprise] && enLigne[entreprise][nomVendeur]);
}

export function listerHistoriqueConnexions(entreprise, nomVendeur = null) {
  return historique.filter((h) => h.entreprise === entreprise && (!nomVendeur || h.nomVendeur === nomVendeur));
}