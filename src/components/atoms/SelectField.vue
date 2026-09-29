<!--
  SelectField.vue (atom)
  --------------------------------------------------------------
  Rôle : liste déroulante générique utilisée pour les filtres
  "Toutes les categories" / "tous les statuts". S'appuie sur un
  vrai <select> HTML (accessible, utilisable au clavier) plutôt
  qu'un composant maison, la maquette ne demandant pas d'habillage
  visuel complexe.

  Props :
    - modelValue : valeur sélectionnée
    - options     : [{ value, label }]
  Emits :
    - update:modelValue
-->
<template>
  <div class="select-field">
    <select
      class="select-field__control"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <span class="select-field__chevron" aria-hidden="true">⌄</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.select-field {
  position: relative;
  min-width: 190px;
}

.select-field__control {
  width: 100%;
  appearance: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #ffffff;
  padding: 10px 36px 10px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  font-style: italic;
  color: var(--color-text-main);
  cursor: pointer;
}

.select-field__chevron {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1rem;
}
</style>
