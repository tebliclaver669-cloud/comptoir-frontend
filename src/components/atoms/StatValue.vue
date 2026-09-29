<!--
  StatValue.vue (atom)
  --------------------------------------------------------------
  Rôle : afficher une valeur en gros caractères italiques, ex
  "951.000 CFA". Composant purement visuel.

  Props :
    - value : valeur déjà formatée à afficher
-->
<template>
  <p class="stat-value">{{ value }}</p>
</template>

<script setup>
defineProps({
  value: { type: [String, Number], required: true },
});
</script>

<style scoped>
.stat-value {
  margin: 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 700;
  font-size: 1.7rem;
}
</style>