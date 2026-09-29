<!--
  CassePerteTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau "CASSE /PERTE" du tableau de bord vendeur. Sur la
  maquette, seule la colonne "QTE" est visible, sans donnée
  renseignée : cette fonctionnalité (déclarer une casse ou une
  perte de produit) n'est pas encore spécifiée dans le cahier des
  charges au-delà de son emplacement dans la maquette. On pose la
  structure (une ligne par produit, comme les autres tableaux) avec
  une quantité vide, prête à être rendue éditable quand la règle
  métier sera précisée (probablement un champ de saisie similaire
  à QuantityInputPill, comme la colonne Appro de l'Approvisionnement).

  Props :
    - products : tableau de produits (juste pour aligner une ligne
      par produit avec les autres tableaux de la page)
-->
<template>
  <SectionTable title="CASSE /PERTE" :columns="columns" :rows="rows" />
</template>

<script setup>
import { computed } from 'vue';
import SectionTable from './SectionTable.vue';

const props = defineProps({
  products: { type: Array, required: true },
});

const columns = [{ key: 'qte', label: 'QTE' }];

// Une ligne vide par produit, pour que le tableau s'aligne
// visuellement avec les autres colonnes de la page (Produits,
// Ventes, Bilan partagent le même nombre de lignes).
const rows = computed(() => props.products.map(() => ({ qte: '' })));
</script>
