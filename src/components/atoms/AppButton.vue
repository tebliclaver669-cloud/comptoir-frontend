<!--
  AppButton.vue (atom)
  --------------------------------------------------------------
  Rôle : bouton gris arrondi générique, utilisé pour "Entrer" et
  "Creer un compte" sur cette page, et réutilisable sur les futures
  pages (connexion, inscription...).

  Props :
    - label : texte du bouton
    - type  : 'button' | 'submit' (par défaut 'button')
    - size  : 'md' (par défaut, ex "Entrer") | 'lg' (ex "S'inscrire",
              bouton plus large et plus haut utilisé en bas des
              formulaires)
    - disabled : désactive le bouton (ex : "S'inscrire en tant que
              vendeur" n'est cliquable que si "Vendeur" est
              sélectionné dans le toggle de la page de connexion)
  Emits :
    - click
-->
<template>
  <button
    class="app-button"
    :class="`app-button--${size}`"
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'button' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>

<style scoped>
.app-button {
  border: 1px solid var(--color-border);
  border-radius: 11px;
  padding: 0;
  background: var(--color-bg-button);
  font-family: var(--font-interface);
  font-style: italic;
  font-size: 24px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  line-height: 1;
  min-width: 128px;
  height: 35px;
}

.app-button--lg {
  padding: 14px 48px;
  font-size: 1.05rem;
  border-radius: var(--radius-md);
  min-width: auto;
  height: auto;
}

.app-button:hover {
  background: #c3c3c3;
}

.app-button:focus-visible {
  outline: 2px solid #1a1a1a;
  outline-offset: 2px;
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-button:disabled:hover {
  background: var(--color-bg-button);
}
</style>
