<!--
  RoundIconButton.vue (atom)
  --------------------------------------------------------------
  Rôle : bouton rond sombre contenant une seule icône, sans texte
  (le panier en haut à droite du Catalogue vendeur). Différent
  d'IconButton (petit carré à bordure fine, utilisé pour l'action
  "modifier" dans un tableau) : celui-ci est plus grand, en relief,
  et sert d'action principale de la page plutôt que d'action de ligne.

  Props :
    - icon  : caractère/emoji affiché
    - label : texte accessible (aria-label), non affiché visuellement
  Emits :
    - click
-->
<template>
  <button class="round-icon-button" type="button" :aria-label="label" @click="$emit('click')">
    {{ icon }}
  </button>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
});
defineEmits(['click']);
</script>

<style scoped>
.round-icon-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #4a4a4a;
  color: #ffffff;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.round-icon-button:hover {
  background: #3a3a3a;
}

.round-icon-button:focus-visible {
  outline: 2px solid #1a1a1a;
  outline-offset: 2px;
}
</style>
