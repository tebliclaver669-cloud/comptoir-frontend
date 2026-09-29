<!--
  ConnexionTransition.vue (organism)
  --------------------------------------------------------------
  Rôle : écran de transition plein écran affiché juste après une
  connexion réussie — un anneau se trace autour du "C" (même style
  que le filigrane de ConnexionPage.vue : Fraunces italique)
  pendant que la lettre se remplit de couleur du bas vers le haut,
  puis le parent est prévenu (événement "termine") pour naviguer
  vers le tableau de bord.
-->
<template>
  <div class="connexion-transition">
    <div class="connexion-transition__logo">
      <svg class="connexion-transition__anneau" viewBox="0 0 200 200" aria-hidden="true">
        <circle class="connexion-transition__anneau-fond" cx="100" cy="100" r="90" />
        <circle class="connexion-transition__anneau-trace" cx="100" cy="100" r="90" />
      </svg>
      <span class="connexion-transition__c connexion-transition__c--contour" aria-hidden="true">C</span>
      <span class="connexion-transition__c connexion-transition__c--plein">C</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// Doit correspondre à la durée des animations "remplir"/"tracer-cercle" ci-dessous.
const DUREE_MS = 3000;

const emit = defineEmits(['termine']);

onMounted(() => {
  setTimeout(() => emit('termine'), DUREE_MS);
});
</script>

<style scoped>
.connexion-transition {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EDE7D6;
}

.connexion-transition__logo {
  position: relative;
  width: 180px;
  height: 180px;
  animation: apparition 0.3s ease-out;
}

.connexion-transition__anneau {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* le tracé démarre en haut du cercle */
}

.connexion-transition__anneau-fond {
  fill: none;
  stroke: var(--color-border, #DCD3BE);
  stroke-width: 3;
}

.connexion-transition__anneau-trace {
  fill: none;
  stroke: var(--color-green, #4C6B3F);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 565.48;
  stroke-dashoffset: 565.48;
  animation: tracer-cercle 3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.connexion-transition__c {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display, 'Fraunces', serif);
  font-style: italic;
  font-weight: 600;
  font-size: 110px;
  line-height: 1;
}

.connexion-transition__c--contour {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--color-tan, #A9825C);
}

.connexion-transition__c--plein {
  color: var(--color-green, #4C6B3F);
  clip-path: inset(100% 0 0 0);
  animation: remplir 3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes remplir {
  from { clip-path: inset(100% 0 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

@keyframes tracer-cercle {
  to { stroke-dashoffset: 0; }
}

@keyframes apparition {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
</style>