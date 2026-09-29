<!--
  MontantFieldRow.vue (molecule)
  --------------------------------------------------------------
  Rôle : une ligne "Total = [ 624.000 CFA ]" du bloc en bas de
  page. Lecture seule pour Total/Restant (calculés), éditable pour
  Remise (saisie par le gérant).

  Props :
    - label, modelValue, readonly
  Emits :
    - update:modelValue
-->
<template>
  <div class="montant-field-row">
    <span class="montant-field-row__label">{{ label }}</span>
    <span class="montant-field-row__equal">=</span>
    <input
      class="montant-field-row__input"
      type="text"
      :readonly="readonly"
      :value="modelValue"
      :placeholder="readonly ? '' : '0 CFA'"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  readonly: { type: Boolean, default: false },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.montant-field-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-bottom: 4px;
}

.montant-field-row__label {
  font-weight: 700;
  font-style: italic;
  font-size: 0.8rem;
  min-width: 60px;
  text-align: right;
}

.montant-field-row__input {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 2px 8px;
  width: 140px;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
  background: #ffffff;
}

.montant-field-row__input[readonly] {
  background: #f4f4f4;
}
</style>