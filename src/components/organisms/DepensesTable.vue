<!--
  DepensesTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau "Dépenses" -> prix d'achat unitaire + total,
  déjà calculés dans la page.
-->
<template>
  <SectionTable title="Dépenses" :columns="columns" :rows="products">
    <template #cell-prixAchatUnitaire="{ row }">{{ formatCFA(row.prixAchatUnitaire) }}</template>
    <template #cell-prixAchatTotal="{ row }">{{ formatCFA(row.prixAchatTotal) }}</template>
  </SectionTable>
</template>

<script setup>
import SectionTable from './SectionTable.vue';
import { formatCFA } from '../../utils/format';

defineProps({
  products: { type: Array, required: true },
});

const columns = [
  { key: 'prixAchatUnitaire', label: 'Prix unitaire' },
  { key: 'prixAchatTotal', label: "Prix d'achat total" },
];
</script>
