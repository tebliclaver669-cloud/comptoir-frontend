<!--
  PartVentesJourBar.vue (organism)
  --------------------------------------------------------------
  Rôle : une seule barre segmentée montrant la part de chaque
  produit dans le total des UNITÉS vendues aujourd'hui (pas le
  chiffre d'affaires). percent = qteVendue / totalQteVendue * 100.
  Couleur assignée par produit depuis une palette de marque fixe.

  Props :
    - products : [{ nom, qteVendue }]
-->
<template>
  <section class="part-ventes">
    <div class="part-ventes__header">
      <p class="part-ventes__title">Part des ventes du jour</p>
      <p class="part-ventes__meta">{{ totalQte }} unités vendues aujourd'hui</p>
    </div>

    <div class="part-ventes__bar">
      <div
        v-for="segment in segments"
        :key="segment.nom"
        class="part-ventes__segment"
        :style="{ width: segment.percent + '%', background: segment.color }"
        :title="`${segment.nom} · ${segment.percent}%`"
      />
    </div>

    <div class="part-ventes__legend">
      <span v-for="segment in segments" :key="segment.nom" class="part-ventes__legend-item">
        <span class="part-ventes__dot" :style="{ background: segment.color }" />
        {{ segment.nom }} · {{ segment.percent }}%
      </span>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  products: { type: Array, required: true },
});

const PALETTE = ['#A9825C', '#8C3527', '#2F4A3C', '#6B8F5E', '#B96B4A', '#7A8C6F'];

const totalQte = computed(() => props.products.reduce((somme, p) => somme + p.qteVendue, 0));

const segments = computed(() => {
  const total = totalQte.value;
  return props.products.map((p, index) => ({
    nom: p.nom,
    percent: total === 0 ? 0 : Math.round((p.qteVendue / total) * 100),
    color: PALETTE[index % PALETTE.length],
  }));
});
</script>

<style scoped>
.part-ventes {
  background: var(--color-green-soft);
  border: 1px solid #B7CBAF;
  border-radius: var(--radius-lg);
  padding: 12px var(--space-lg);
  margin: 0 var(--space-xl) var(--space-lg);
  box-sizing: border-box;
}

.part-ventes__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-sm);
}

.part-ventes__title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--color-green);
}

.part-ventes__meta {
  margin: 0;
  font-size: 11px;
  color: var(--color-green);
}

.part-ventes__bar {
  display: flex;
  height: 16px;
  border-radius: 999px;
  overflow: hidden;
}

.part-ventes__segment {
  height: 100%;
}

.part-ventes__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-sm);
  font-size: 0.72rem;
  color: var(--color-ink);
}

.part-ventes__legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.part-ventes__dot {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  flex-shrink: 0;
}
</style>