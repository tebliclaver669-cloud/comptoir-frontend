<!--
  ActionButton.vue (molecule)
  --------------------------------------------------------------
  Rôle : bouton "+ Ajouter produit" / "− Supprimer produit", avec
  un symbole devant le texte. On le distingue d'AppButton (page
  publiques) car ce style (icône + texte, fond légèrement grisé,
  bordure marquée) est propre à l'espace gérant.

  Props :
    - icon  : symbole affiché avant le texte ("+", "−"...)
    - label : texte du bouton
  Emits :
    - click
-->
<template>
  <button class="action-button" type="button" @click="$emit('click')">
    <span class="action-button__icon" aria-hidden="true">{{ icon }}</span>
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
});
defineEmits(['click']);
</script>

<style scoped>
.action-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-panel-muted);
  padding: 10px 18px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
}

.action-button:hover {
  background: #d8d7d5;
}

.action-button__icon {
  font-weight: 800;
}
</style>
