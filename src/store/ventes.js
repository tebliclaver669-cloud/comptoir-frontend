/**
 * ventes.js
 * ----------------------------------------------------------------
 * Liste des produits vendus AUJOURD'HUI, lue depuis le backend
 * (GET /api/ventes/:nomEntreprise/jour). Le tableau est modifié en
 * place (splice) pour que les pages qui l'affichent se mettent à jour.
 */
import { reactive } from 'vue';
import { get } from '../services/api';

const ventesDuJour = reactive([]);

export function listerVentesDuJour() {
  return ventesDuJour;
}

export async function chargerVentesDuJour(nomEntreprise) {
  const reponse = await get(`/ventes/${encodeURIComponent(nomEntreprise)}/jour`);
  ventesDuJour.splice(0, ventesDuJour.length, ...reponse);
}
