<!--
  LoginField.vue (molecule)
  --------------------------------------------------------------
  Rôle : combine FieldLabel + TextField + AppButton pour former le
  bloc de connexion "Utilisateur [nom de l'entreprise] Entrer".

  Props :
    - modelValue : v-model, nom d'entreprise saisi
  Emits :
    - update:modelValue
    - submit : quand l'utilisateur clique "Entrer" (le parent gère
               la validation + la navigation vers le tableau de bord)
-->
<template>
  <form class="login-field" @submit.prevent="$emit('submit')">
    <span class="login-field__label">Utilisateur</span>
    <TextField
      :model-value="modelValue"
      placeholder="nom de l'entreprise"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <AppButton label="Entrer" type="submit" />
  </form>
</template>

<script setup>
import TextField from '../atoms/TextField.vue';
import AppButton from '../atoms/AppButton.vue';

defineProps({
  modelValue: { type: String, default: '' },
});
defineEmits(['update:modelValue', 'submit']);
</script>

<style scoped>
.login-field {
  display: flex;
  align-items: center;
  gap: 22px;
}

.login-field__label {
  font-family: var(--font-interface);
  font-weight: 700;
  font-style: italic;
  white-space: nowrap;
  color: var(--color-text-main);
  flex-shrink: 0;
  order: 1;
  font-size: 24px;
  min-width: fit-content;
  line-height: 1;
}

.login-field :deep(.text-field) {
  width: 295px;
  height: 35px;
  flex-shrink: 0;
  order: 2;
}

.login-field :deep(.app-button) {
  width: 128px;
  height: 35px;
  flex-shrink: 0;
  order: 3;
}
</style>
