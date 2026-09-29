<!--
  MoisSelect.vue (molecule)
  --------------------------------------------------------------
  Rôle : menu déroulant pour choisir un mois. Les mois ne sont PAS
  des mois calendaires fixes : ce sont des mois glissants ancrés sur
  la date d'inscription de l'entreprise (options fournies par le
  parent, StatistiquesPage.vue), et seuls les mois COMPLETS
  apparaissent. Affiché uniquement quand la vue "Mensuel" est
  active.

  Props :
    - modelValue : la valeur du mois sélectionné (ex. '1', '2'...)
    - options : [{ value, label }] — mois complets disponibles,
      fournis par le parent (vide tant qu'aucun mois n'est complet)
-->
<template>
  <select
    class="mois-select"
    :value="modelValue"
    :disabled="options.length === 0"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option v-if="options.length === 0" value="">Aucun mois complet</option>
    <option v-for="mois in options" :key="mois.value" :value="mois.value">{{ mois.label }}</option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.mois-select {
  height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-cream-light);
  padding: 0 14px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
  cursor: pointer;
}

.mois-select:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>