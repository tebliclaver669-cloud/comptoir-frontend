<!--
  ValeurVentesCard.vue (molecule)
  --------------------------------------------------------------
  Rôle : la carte grise "Valeur des ventes" en haut à gauche du
  tableau de bord VENDEUR. Contrairement à ValeurStockCard (un
  gros chiffre unique côté gérant), elle combine 3 lignes
  Total/Remise/Restant -> c'est en fait le même besoin que
  VenteTotalRemiseCard (déjà utilisée en bas de page côté gérant),
  mais positionnée ici en tête de page avec un titre différent.
  On réutilise MontantFieldRow pour ne pas dupliquer cette logique
  d'affichage.

  Props :
    - total : montant total des ventes (number)
  La remise reste en state local, comme pour VenteTotalRemiseCard.
-->
<template>
  <div class="valeur-ventes-card">
    <p class="valeur-ventes-card__label">Valeur des ventes</p>
    <MontantFieldRow label="Total" :model-value="formatCFA(total)" readonly />
    <MontantFieldRow label="Remise" v-model="remiseSaisie" />
    <MontantFieldRow label="Restant" :model-value="formatCFA(restant)" readonly />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MontantFieldRow from './MontantFieldRow.vue';
import { formatCFA } from '../../utils/format';

const props = defineProps({
  total: { type: Number, required: true },
});

const remiseSaisie = ref('');

const remiseNumerique = computed(() => {
  const chiffres = remiseSaisie.value.toString().replace(/[^\d]/g, '');
  return chiffres ? parseInt(chiffres, 10) : 0;
});

const restant = computed(() => props.total - remiseNumerique.value);
</script>

<style scoped>
.valeur-ventes-card {
  background: var(--color-bg-panel-muted);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  min-width: 300px;
}

.valeur-ventes-card__label {
  margin: 0 0 var(--space-md);
  font-weight: 700;
  font-style: italic;
}

.valeur-ventes-card :deep(.montant-field-row) {
  justify-content: space-between;
}
</style>
