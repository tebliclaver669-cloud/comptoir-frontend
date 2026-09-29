/**
 * format.js
 * ----------------------------------------------------------------
 * Petites fonctions de formatage réutilisées par plusieurs
 * composants (tableaux, indicateurs...). Centralisées ici pour ne
 * pas dupliquer la logique "11000 -> 11.000" dans chaque composant.
 */

/**
 * Formate un nombre en séparant les milliers par un point,
 * comme sur les maquettes : 951000 -> "951.000"
 * @param {number} value
 * @returns {string}
 */
export function formatMontant(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formate un montant avec le suffixe "CFA" : 951000 -> "951.000 CFA"
 * @param {number} value
 * @returns {string}
 */
export function formatCFA(value) {
  return `${formatMontant(value)} CFA`;
}
