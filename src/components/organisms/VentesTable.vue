<!--
  VentesTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau "Ventes" -> prix de vente unitaire, quantité
  vendue, vente totale.
-->
<template>
  <SectionTable title="Ventes" :columns="columns" :rows="products">
    <template #cell-prixVenteUnitaire="{ row }">{{ formatCFA(row.prixVenteUnitaire) }}</template>
    <template #cell-venteTotal="{ row }">{{ formatCFA(row.venteTotal) }}</template>
  </SectionTable>
</template>

<script setup>
import SectionTable from './SectionTable.vue';
import { formatCFA } from '../../utils/format';

defineProps({
  products: { type: Array, required: true },
});

const columns = [
  { key: 'prixVenteUnitaire', label: 'Prix unitaire' },
  { key: 'qteVendue', label: 'Qte' },
  { key: 'venteTotal', label: 'Vente total' },
];
</script>
