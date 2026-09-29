<!--
  BadgeCategorie.vue (atom)
  --------------------------------------------------------------
  Rôle : pastille jaune-vert affichant la catégorie d'un produit
  ("Alimentation", "Boisson"...), utilisée dans le catalogue.

  Props :
    - label : texte de la catégorie
-->
<template>
  <span class="badge-categorie">{{ label }}</span>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
});
</script>

<style scoped>
.badge-categorie {
  display: inline-block;
  background: var(--color-green-soft);
  color: var(--color-green);
  font-weight: 500;
  padding: 3px 9px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  white-space: nowrap;
}
</style>