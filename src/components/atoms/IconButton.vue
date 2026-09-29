<!--
  IconButton.vue (atom)
  --------------------------------------------------------------
  Rôle : petit bouton carré à bordure fine contenant une icône
  (crayon "modifier", etc.), réutilisable partout où une action
  compacte est nécessaire dans un tableau.

  Props :
    - icon  : caractère/emoji affiché (simplifié ici, un vrai set
              d'icônes SVG pourra remplacer ça plus tard)
    - label : texte accessible (aria-label), non affiché visuellement
  Emits :
    - click
-->
<template>
  <button class="icon-button" type="button" :aria-label="label" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
});
defineEmits(['click']);
</script>

<style scoped>
.icon-button {
  width: 30px;
  height: 30px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-cream-light);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background: var(--color-bg-panel-muted);
}

.icon-button:focus-visible {
  outline: 2px solid var(--color-tan);
  outline-offset: 1px;
}
</style>