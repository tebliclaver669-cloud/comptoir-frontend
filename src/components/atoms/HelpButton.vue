<!--
  HelpButton.vue (atom)
  --------------------------------------------------------------
  Rôle : le rond noir "?" en haut à droite de la maquette, qui
  ouvrira une aide/FAQ. On l'implémente comme un vrai <button>
  (et pas un <div> cliquable) pour l'accessibilité clavier.

  Emits :
    - click : remonté au parent, qui décidera quoi faire
              (ouvrir une modale d'aide, rediriger vers une page
              FAQ, etc.) -> cet atom ne décide de rien lui-même.
-->
<template>
  <button class="help-button" type="button" aria-label="Aide" @click="$emit('click')">
    ?
  </button>
</template>

<script setup>
defineEmits(['click']);
</script>

<style scoped>
.help-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 700;
  font-family: var(--font-serif);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-button:hover {
  opacity: 0.85;
}

.help-button:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
}
</style>
