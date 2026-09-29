<!--
  SupplierInfo.vue (molecule)
  --------------------------------------------------------------
  Rôle : affiche le nom du fournisseur en gras et son numéro de
  téléphone en dessous, en plus petit -> reproduit la cellule
  "FOURNISSEURS" du tableau (ex "M.Hamed" / "0707070707").

  Props :
    - nom       : nom du fournisseur
    - telephone : numéro de téléphone
-->
<template>
  <div class="supplier-info">
    <p class="supplier-info__nom">{{ nom }}</p>
    <p class="supplier-info__telephone">{{ telephone }}</p>
  </div>
</template>

<script setup>
defineProps({
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
});
</script>

<style scoped>
.supplier-info {
  line-height: 1.3;
}

.supplier-info__nom {
  margin: 0;
  font-weight: 700;
  font-size: 0.85rem;
}

.supplier-info__telephone {
  margin: 0;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}
</style>
