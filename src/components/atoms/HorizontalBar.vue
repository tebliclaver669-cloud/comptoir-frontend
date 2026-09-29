<!--
  HorizontalBar.vue (atom)
  --------------------------------------------------------------
  Rôle : une barre horizontale style "pilule" (fond blanc, bordure
  noire, coins très arrondis) dont le remplissage part de la
  gauche sur `percent` % de la largeur. Remplace VerticalBar : le
  graphique des ventes est maintenant disposé horizontalement
  (une ligne par produit) plutôt qu'en colonnes verticales.

  Props :
    - percent : 0 à 100, largeur du remplissage
    - color   : couleur du remplissage (calculée par le parent en
                fonction du pourcentage, cf. utils/color.js)
-->
<template>
  <div class="horizontal-bar">
    <div class="horizontal-bar__fill" :style="{ width: `${percent}%`, background: color }" />
  </div>
</template>

<script setup>
defineProps({
  percent: { type: Number, required: true },
  color: { type: String, required: true },
});
</script>

<style scoped>
.horizontal-bar {
  width: 100%;
  height: 22px;
  background: #ffffff;
  border: 2px solid var(--color-bar-border, #1f1f1f);
  border-radius: 11px;
  overflow: hidden;
}

.horizontal-bar__fill {
  height: 100%;
  border-radius: 11px 0 0 11px;
  transition: width 0.4s ease, background 0.4s ease;
}
</style>
