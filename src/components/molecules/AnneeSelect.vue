<!--
  AnneeSelect.vue (molecule)
  --------------------------------------------------------------
  Rôle : menu déroulant pour choisir une année précise. Affiché
  uniquement quand la vue "Annuel" est active. Les années
  disponibles sont déduites des données mockées (donneesAnnuelles),
  transmises par le parent plutôt que codées en dur ici.

  Props :
    - modelValue : année sélectionnée (ex. '2026')
    - anneesDisponibles : ['2024', '2025', '2026']
-->
<template>
  <select class="annee-select" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
    <option v-for="annee in anneesDisponibles" :key="annee" :value="annee">{{ annee }}</option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  anneesDisponibles: { type: Array, required: true },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.annee-select {
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
</style>