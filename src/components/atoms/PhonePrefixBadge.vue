<!--
  PhonePrefixBadge.vue (atom)
  --------------------------------------------------------------
  Rôle : la pastille grise "+225" accolée au champ téléphone. Non
  éditable pour l'instant (indicatif fixe) : si le projet doit
  gérer plusieurs pays plus tard, on la transformera en <select>
  sans changer les composants qui l'utilisent.

  Props :
    - code : l'indicatif affiché (ex "+225")
-->
<template>
  <span class="phone-prefix-badge">{{ code }}</span>
</template>

<script setup>
defineProps({
  code: { type: String, required: true },
});
</script>

<style scoped>
.phone-prefix-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-panel-muted, #c9c7c2);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  padding: 0 var(--space-md);
  font-weight: 700;
  font-style: italic;
  white-space: nowrap;
}
</style>
