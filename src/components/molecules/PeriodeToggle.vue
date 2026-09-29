<!--
  PeriodeToggle.vue (molecule)
  --------------------------------------------------------------
  Rôle : bascule Mensuel / Annuel, même pattern visuel que le
  toggle Gérant/Vendeur de la page Connexion.

  Props :
    - modelValue : 'mensuel' | 'annuel'
-->
<template>
  <div class="periode-toggle">
    <button
      type="button"
      class="periode-toggle__btn"
      :class="{ 'periode-toggle__btn--active': modelValue === 'mensuel' }"
      @click="$emit('update:modelValue', 'mensuel')"
    >
      Mensuel
    </button>
    <button
      type="button"
      class="periode-toggle__btn"
      :class="{ 'periode-toggle__btn--active': modelValue === 'annuel' }"
      @click="$emit('update:modelValue', 'annuel')"
    >
      Annuel
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'mensuel' },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.periode-toggle {
  display: inline-flex;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.periode-toggle__btn {
  border: none;
  background: var(--color-cream-light);
  color: var(--color-ink-muted);
  font-weight: 600;
  font-size: 13px;
  padding: 8px 20px;
  cursor: pointer;
}

.periode-toggle__btn--active {
  background: var(--color-green);
  color: var(--color-text-on-dark);
}
</style>