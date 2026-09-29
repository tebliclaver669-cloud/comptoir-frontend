<!--
  SegmentButton.vue (atom)
  --------------------------------------------------------------
  Rôle : un des deux boutons collés du toggle "Gérant / Vendeur".
  Purement visuel + un événement click ; c'est le parent (molecule
  RoleToggle) qui décide lequel des deux est actif.

  Props :
    - label  : "Gérant" ou "Vendeur"
    - active : true si ce segment est actuellement sélectionné
               (fond gris comme sur la maquette), false sinon
               (fond blanc)
  Emits :
    - click
-->
<template>
  <button
    type="button"
    class="segment-button"
    :class="{ 'segment-button--active': active }"
    :aria-pressed="active"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>

<style scoped>
.segment-button {
  border: none;
  background: var(--color-bg-card);
  padding: 18px 36px;
  font-weight: 800;
  font-style: italic;
  font-size: 1.3rem;
  cursor: pointer;
  color: var(--color-text-main);
}

.segment-button--active {
  background: #a3a3a3;
}

.segment-button:focus-visible {
  outline: 2px solid #1a1a1a;
  outline-offset: -4px;
}
</style>
