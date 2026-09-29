<!--
  TextField.vue (atom)
  --------------------------------------------------------------
  Rôle : champ de saisie texte simple, réutilisable sur toutes les
  pages du projet (accueil, connexion, inscription...).

  Props :
    - modelValue  : valeur du champ (v-model)
    - placeholder : texte d'aide affiché en italique dans la maquette
    - type        : type HTML natif du champ ('text' | 'email' |
                     'password' | 'tel'...), pour bénéficier des
                     claviers adaptés sur mobile et de la
                     validation native du navigateur
  Emits :
    - update:modelValue -> pour le v-model
-->
<template>
  <input
    class="text-field"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.text-field {
  border: 1px solid var(--color-border);
  border-radius: 11px;
  padding: 5px 14px;
  font-family: var(--font-interface);
  font-size: 24px;
  font-style: italic;
  font-weight: 300;
  background: var(--color-bg-card);
  color: var(--color-text-main);
  flex-shrink: 0;
  box-sizing: border-box;
  line-height: 1;
}

.text-field::placeholder {
  color: #8a8a8a;
  font-style: italic;
}

.text-field:focus {
  outline: 2px solid #1a1a1a;
  outline-offset: 1px;
}
</style>
