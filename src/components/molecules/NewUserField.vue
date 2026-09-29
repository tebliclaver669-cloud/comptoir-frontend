<!--
  NewUserField.vue (molecule)
  --------------------------------------------------------------
  Rôle : combine FieldLabel + AppButton pour le bloc "Nouvel
  utilisateur   Creer un compte" à droite de la barre.

  Emits :
    - click : le parent gère la navigation vers la page d'inscription.
-->
<template>
  <div class="new-user-field">
    <span class="new-user-field__label">Nouvel utilisateur</span>
    <AppButton label="Creer un compte" @click="$emit('click')" />
  </div>
</template>

<script setup>
import AppButton from '../atoms/AppButton.vue';

defineEmits(['click']);
</script>

<style scoped>
.new-user-field {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-left: auto;
}

.new-user-field__label {
  font-family: var(--font-interface);
  font-weight: 700;
  font-style: italic;
  color: var(--color-text-main);
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 24px;
  line-height: 1;
}

.new-user-field :deep(.app-button) {
  width: 229px;
  height: 35px;
}
</style>
