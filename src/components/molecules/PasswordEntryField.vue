<!--
  PasswordEntryField.vue (molecule)
  --------------------------------------------------------------
  Rôle : ligne "Entrer le mot de passe [......] Entrer". Structure
  proche de LoginField (page d'accueil) mais avec un champ de type
  password et un libellé différent -> on la garde séparée plutôt
  que de forcer LoginField à devenir générique, car les deux
  champs n'ont pas le même sens métier (nom d'entreprise vs mot de
  passe).

  Props :
    - modelValue : v-model, mot de passe saisi
  Emits :
    - update:modelValue
    - submit : au clic sur "Entrer" (le parent gère la validation)
-->
<template>
  <form class="password-entry-field" @submit.prevent="$emit('submit')">
    <FieldLabel text="Entrer le mot de passe" />
    <TextField
      type="password"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <AppButton label="Entrer" type="submit" />
  </form>
</template>

<script setup>
import FieldLabel from '../atoms/FieldLabel.vue';
import TextField from '../atoms/TextField.vue';
import AppButton from '../atoms/AppButton.vue';

defineProps({
  modelValue: { type: String, default: '' },
});
defineEmits(['update:modelValue', 'submit']);
</script>

<style scoped>
.password-entry-field {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.password-entry-field :deep(.text-field) {
  width: 140px;
}
</style>
