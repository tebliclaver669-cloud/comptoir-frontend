/**
 * casses.js
 * ----------------------------------------------------------------
 * Liste PARTAGÉE des casses signalées par les vendeurs. Chaque
 * entrée est IMMUABLE une fois créée (pas de fonction de
 * modification/suppression ici, volontairement) : un vendeur signale
 * une casse, elle apparaît ensuite dans sa propre liste (lecture
 * seule) et dans la fenêtre du gérant, sans pouvoir être modifiée.
 */
import { reactive } from 'vue';

const casses = reactive([]);

export function listerCasses() {
  return casses;
}

export function signalerCasse(casse) {
  casses.unshift({ ...casse });
}