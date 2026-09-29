<!--
  AuthBar.vue (organism)
  --------------------------------------------------------------
  Rôle : la barre grise sous le bandeau logo, avec le bloc
  connexion à gauche (LoginField) et le bloc inscription à droite
  (NewUserField).

  Props :
    - modelValue : nom d'entreprise saisi (v-model, remonté depuis
                   la molecule LoginField)
  Emits :
    - update:modelValue
    - login   : clic sur "Entrer"
    - signup  : clic sur "Creer un compte"
-->
<template>
  <div class="auth-bar">
    <LoginField
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      @submit="$emit('login')"
    />
    <NewUserField @click="$emit('signup')" />
  </div>
</template>

<script setup>
import LoginField from '../molecules/LoginField.vue';
import NewUserField from '../molecules/NewUserField.vue';

defineProps({
  modelValue: { type: String, default: '' },
});
defineEmits(['update:modelValue', 'login', 'signup']);
</script>

<style scoped>
.auth-bar {
  background: var(--color-bg-authbar);
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  flex-wrap: wrap;
  min-height: 35px;
}
</style>
