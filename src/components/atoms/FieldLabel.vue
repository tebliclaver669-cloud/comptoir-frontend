<!--
  FieldLabel.vue (atom)
  --------------------------------------------------------------
  Rôle : libellé en gras italique placé devant un champ/bouton,
  ex "Utilisateur", "Nouvel utilisateur".
-->
<template>
  <span class="field-label">{{ text }}</span>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
});
</script>

<style scoped>
.field-label {
  font-weight: 700;
  font-style: italic;
  white-space: nowrap;
  color: var(--color-text-main);
  display: inline-block;
  line-height: 1;
}
</style>
