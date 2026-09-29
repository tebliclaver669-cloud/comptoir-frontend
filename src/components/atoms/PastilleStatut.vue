<!--
  PastilleStatut.vue (atom)
  --------------------------------------------------------------
  Rôle : petit rond coloré dans la colonne "Appro" du tableau
  Bilan, signalant visuellement :
    - 'sous-seuil' -> rose brique
    - 'rupture'    -> rouge corail
    - null (rien à signaler) -> n'affiche rien

  Props : statut (String | null)
-->
<template>
  <span v-if="statut" class="pastille-statut" :class="`pastille-statut--${statut}`" :title="libelle" />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  statut: { type: String, default: null },
});

const libelle = computed(() => {
  if (props.statut === 'rupture') return 'En rupture de stock';
  if (props.statut === 'sous-seuil') return "Sous le seuil d'alerte";
  return '';
});
</script>

<style scoped>
.pastille-statut {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.pastille-statut--sous-seuil {
  background: var(--color-status-warning-bg);
}

.pastille-statut--rupture {
  background: var(--color-status-critical-bg);
}
</style>
