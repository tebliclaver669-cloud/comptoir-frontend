/**
 * mouvements.js
 * ----------------------------------------------------------------
 * Historique des mouvements de stock, PARTAGÉ (au lieu d'une liste
 * locale à HistoriquePage) — alimenté par Approvisionnement
 * (entrées), les ventes du vendeur (sorties), etc.
 */
import { reactive } from 'vue';

const mouvements = reactive([
  { date: '25/07', heure: '10:40', produit: 'Sucre 1kg', type: 'sortie', quantite: 22, utilisateur: 'Vendeur' },
  { date: '25/07', heure: '10:15', produit: 'Riz local 50kg', type: 'sortie', quantite: 9, utilisateur: 'Vendeur' },
  { date: '22/07', heure: '16:00', produit: 'Riz local 22kg', type: 'entree', quantite: 30, utilisateur: 'Gérant' },
]);

export function listerMouvements() {
  return mouvements;
}

export function ajouterMouvement(mouvement) {
  mouvements.unshift({ ...mouvement });
}