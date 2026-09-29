/**
 * color.js
 * ----------------------------------------------------------------
 * Calcule une couleur continue en fonction d'un pourcentage (0-100),
 * utilisée pour colorer automatiquement chaque barre du graphique
 * "Vue d'ensemble de la statistique des ventes" selon la règle
 * métier définie par l'utilisateur :
 *   - de 0% à 50%   : dégradé du rouge foncé vers le rouge clair
 *   - de 50% à 100% : dégradé du vert clair vers le vert foncé
 */

const ROUGE_FONCE = { r: 179, g: 37, b: 29 }; // #B3251D
const ROUGE_CLAIR = { r: 239, g: 138, b: 131 }; // #EF8A83
const VERT_CLAIR = { r: 155, g: 231, b: 171 }; // #9BE7AB
const VERT_FONCE = { r: 46, g: 125, b: 50 }; // #2E7D32

/**
 * Interpole linéairement entre deux couleurs RGB.
 * @param {{r:number,g:number,b:number}} depart
 * @param {{r:number,g:number,b:number}} arrivee
 * @param {number} t - progression de 0 à 1
 * @returns {string} couleur au format rgb(r, g, b)
 */
function interpoler(depart, arrivee, t) {
  const r = Math.round(depart.r + (arrivee.r - depart.r) * t);
  const g = Math.round(depart.g + (arrivee.g - depart.g) * t);
  const b = Math.round(depart.b + (arrivee.b - depart.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Calcule la couleur d'une barre à partir de son pourcentage.
 * @param {number} pourcentage - de 0 à 100
 * @returns {string} couleur au format rgb(r, g, b)
 */
export function couleurDepuisPourcentage(pourcentage) {
  const p = Math.max(0, Math.min(100, pourcentage));

  if (p <= 50) {
    // 0% -> rouge foncé, 50% -> rouge clair
    return interpoler(ROUGE_FONCE, ROUGE_CLAIR, p / 50);
  }
  // 50% -> vert clair, 100% -> vert foncé
  return interpoler(VERT_CLAIR, VERT_FONCE, (p - 50) / 50);
}
