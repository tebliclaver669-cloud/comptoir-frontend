<!--
  BilanTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau "Bilan" -> stock final, seuil d'alerte, pastille
  "Appro" quand le stock final est sous le seuil ou en rupture.

  Règle métier :
    - stockFinal === 0             -> rupture (pastille rouge)
    - 0 < stockFinal <= seuilAlerte -> sous-seuil (pastille rose)
    - sinon                         -> pas de pastille
  Calculée ici (règle d'affichage), la page ne fournit que
  stockFinal et seuilAlerte.
-->
<template>
  <SectionTable title="Bilan" :columns="columns" :rows="rowsAvecStatut">
    <template #cell-stockFinal="{ row }">
      <span :class="{ 'bilan-table__value--alert': row.statut }">
        {{ String(row.stockFinal).padStart(row.statut === 'rupture' ? 2 : 1, '0') }}
      </span>
    </template>
    <template #cell-appro="{ row }">
      <PastilleStatut :statut="row.statut" />
    </template>
  </SectionTable>
</template>

<script setup>
import { computed } from 'vue';
import SectionTable from './SectionTable.vue';
import PastilleStatut from '../atoms/PastilleStatut.vue';

const props = defineProps({
  products: { type: Array, required: true },
});

const columns = [
  { key: 'stockFinal', label: 'Stock final' },
  { key: 'seuilAlerte', label: "Seuil d'alerte" },
  { key: 'appro', label: 'Appro' },
];

const rowsAvecStatut = computed(() =>
  props.products.map((p) => ({
    ...p,
    statut: p.stockFinal === 0 ? 'rupture' : p.stockFinal <= p.seuilAlerte ? 'sous-seuil' : null,
  }))
);
</script>

<style scoped>
.bilan-table__value--alert {
  color: #d9534f;
  font-weight: 700;
}
</style>
