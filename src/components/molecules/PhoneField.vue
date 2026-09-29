<!--
  PhoneField.vue (molecule)
  --------------------------------------------------------------
  Rôle : reproduit la ligne "Numero" de la maquette : le libellé,
  puis l'indicatif "+225" collé au champ de saisie (les deux
  partagent visuellement un seul bloc arrondi). Séparée de
  FormField (utilisée pour les autres champs) car la présence de
  l'indicatif change la structure interne, pas juste le contenu.

  Props :
    - label       : texte du libellé ("Numero")
    - prefix      : indicatif affiché ("+225")
    - modelValue  : v-model, numéro saisi (sans l'indicatif)
    - placeholder : texte d'aide ("xx-xx-xx-xx-xx")
  Emits :
    - update:modelValue
-->
<template>
  <div class="phone-field">
    <FieldLabel :text="label" class="phone-field__label" />
    <div class="phone-field__control">
      <PhonePrefixBadge :code="prefix" />
      <input
        class="phone-field__input"
        type="tel"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import FieldLabel from '../atoms/FieldLabel.vue';
import PhonePrefixBadge from '../atoms/PhonePrefixBadge.vue';

defineProps({
  label: { type: String, required: true },
  prefix: { type: String, default: '+225' },
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.phone-field {
  display: grid;
  grid-template-columns: 220px minmax(240px, 440px);
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.phone-field__label {
  text-align: right;
}

.phone-field__control {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-bg-card, #fffdfa);
}

.phone-field__input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 14px;
  font-style: italic;
  font-weight: 700;
  font-size: 0.95rem;
  background: transparent;
  color: var(--color-text-main);
}

.phone-field__input::placeholder {
  color: #8a8a8a;
  font-style: italic;
}

@media (max-width: 640px) {
  .phone-field {
    grid-template-columns: 1fr;
    gap: var(--space-xs);
  }

  .phone-field__label {
    text-align: left;
  }
}
</style>
