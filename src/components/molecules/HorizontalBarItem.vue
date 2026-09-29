<!--
  HorizontalBarItem.vue (molecule)
  --------------------------------------------------------------
  Rôle : une ligne du graphique "Vue d'ensemble de la statistique
  des ventes" : le nom du produit et son pourcentage affichés côte
  à côte au-dessus de la barre, puis la barre horizontale en
  dessous. Remplace StatBarItem (disposition verticale).

  Props :
    - label   : nom du produit
    - percent : pourcentage déjà calculé (affiché tel quel, arrondi
                par le parent)
    - color   : couleur de la barre (calculée par le parent)
-->
<template>
  <div class="horizontal-bar-item">
    <div class="horizontal-bar-item__row">
      <span class="horizontal-bar-item__label">{{ label }}</span>
      <span class="horizontal-bar-item__percent">{{ percent }}%</span>
    </div>
    <HorizontalBar :percent="percent" :color="color" />
  </div>
</template>

<script setup>
import HorizontalBar from '../atoms/HorizontalBar.vue';

defineProps({
  label: { type: String, required: true },
  percent: { type: Number, required: true },
  color: { type: String, required: true },
});
</script>

<style scoped>
.horizontal-bar-item {
  width: 100%;
}

.horizontal-bar-item__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.horizontal-bar-item__label {
  font-style: italic;
  font-size: 0.9rem;
}

.horizontal-bar-item__percent {
  font-weight: 700;
  font-size: 0.85rem;
}
</style>
