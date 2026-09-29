<!--
  TauxEcoulementBar.vue (organism)
  --------------------------------------------------------------
  Rôle : affiche pour CHAQUE produit son propre taux d'écoulement :
  quelle part de son stock initial a déjà été vendue aujourd'hui.
  percent = qteVendue / stockInitial * 100 (toujours <= 100, car
  qteVendue ne peut pas dépasser stockInitial). Un produit à 100%
  a entièrement épuisé son stock.

  Props :
    - products : [{ nom, qteVendue, stockInitial }]
-->
<template>
  <section class="taux-ecoulement">
    <div class="taux-ecoulement__header">
      <p class="taux-ecoulement__title">Taux d'écoulement du stock</p>
      <p class="taux-ecoulement__meta">part du stock initial déjà vendue, par produit</p>
    </div>

    <div class="taux-ecoulement__rows">
      <div v-for="item in items" :key="item.nom" class="taux-ecoulement__row">
        <div class="taux-ecoulement__row-header">
          <span class="taux-ecoulement__nom" :class="{ 'taux-ecoulement__nom--epuise': item.percent === 100 }">
            {{ item.nom }}
          </span>
          <span class="taux-ecoulement__detail" :class="{ 'taux-ecoulement__detail--epuise': item.percent === 100 }">
            {{ item.qteVendue }} / {{ item.stockInitial }} · {{ item.percent }}%
            <template v-if="item.percent === 100"> · stock épuisé</template>
          </span>
        </div>
        <div class="taux-ecoulement__track">
          <div
            class="taux-ecoulement__fill"
            :style="{ width: item.percent + '%', background: item.color }"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  products: { type: Array, required: true },
});

const PALETTE = ['#A9825C', '#8C3527', '#2F4A3C', '#6B8F5E', '#B96B4A', '#7A8C6F'];

const items = computed(() =>
  props.products.map((p, index) => ({
    nom: p.nom,
    qteVendue: p.qteVendue,
    stockInitial: p.stockInitial,
    percent: p.stockInitial === 0 ? 0 : Math.round((p.qteVendue / p.stockInitial) * 100),
    color: PALETTE[index % PALETTE.length],
  }))
);
</script>

<style scoped>
.taux-ecoulement {
  background: var(--color-green-soft);
  border: 1px solid #B7CBAF;
  border-radius: var(--radius-lg);
  padding: 12px var(--space-lg);
  margin: 0 var(--space-xl) var(--space-lg);
  box-sizing: border-box;
}

.taux-ecoulement__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-sm);
}

.taux-ecoulement__title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--color-green);
}

.taux-ecoulement__meta {
  margin: 0;
  font-size: 11px;
  color: var(--color-green);
}

.taux-ecoulement__rows {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.taux-ecoulement__row-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 3px;
}

.taux-ecoulement__nom {
  font-weight: 500;
  color: var(--color-ink);
}

.taux-ecoulement__nom--epuise {
  font-weight: 700;
}

.taux-ecoulement__detail {
  color: var(--color-green);
}

.taux-ecoulement__detail--epuise {
  font-weight: 600;
}

.taux-ecoulement__track {
  height: 8px;
  border-radius: 999px;
  background: #C7D6C1;
}

.taux-ecoulement__fill {
  height: 100%;
  border-radius: 999px;
}
</style>