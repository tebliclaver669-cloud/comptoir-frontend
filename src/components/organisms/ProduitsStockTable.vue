<!--
  ProduitsStockTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau "Produits categorie et stock". Utilise SectionTable
  avec un slot personnalisé pour la colonne "categorie" (badge).

  Props :
    - products : tableau d'objets produit
-->
<template>
  <SectionTable title="Produits categorie et stock" :columns="columns" :rows="products">
    <template #cell-categorie="{ row }">
      <BadgeCategorie :label="row.categorie" />
    </template>
    <template #cell-stockInitial="{ row }">
      <strong>{{ row.stockInitial }}</strong>
    </template>
  </SectionTable>
</template>

<script setup>
import SectionTable from './SectionTable.vue';
import BadgeCategorie from '../atoms/BadgeCategorie.vue';

defineProps({
  products: { type: Array, required: true },
});

const columns = [
  { key: 'nom', label: 'Nom du produits' },
  { key: 'categorie', label: 'Catégorie' },
  { key: 'stockInitial', label: 'Stock initial' },
];
</script>
