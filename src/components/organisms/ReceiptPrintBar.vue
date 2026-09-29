<!--
  ReceiptPrintBar.vue (organism)
  --------------------------------------------------------------
  Rôle : la barre du bas avec le bouton "Imprimé reçu journalier"
  (texte de la maquette conservé tel quel). Réutilise ActionButton
  (icône + texte), déjà utilisée côté gérant pour "Ajouter produit".

  Emits :
    - imprimer-click
-->
<template>
  <div class="receipt-print-bar">
    <ActionButton icon="🖨" label="Imprimé reçu journalier" @click="$emit('imprimer-click')" />
  </div>
</template>

<script setup>
import ActionButton from '../molecules/ActionButton.vue';

defineEmits(['imprimer-click']);
</script>

<style scoped>
.receipt-print-bar {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-lg) var(--space-xl);
}
</style>
