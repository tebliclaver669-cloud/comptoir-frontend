<!--
  MouvementsStatsCard.vue (organism)
  --------------------------------------------------------------
  Rôle : 4 cartes pour la période choisie. "Produits entrés",
  "Produits vendus" et "Pertes" sont cliquables et ouvrent chacune
  leur fenêtre de détail ; "Coût des pertes" déclenche la même
  fenêtre que "Pertes" (même liste, le coût y est déjà visible).

  Props :
    - stats : { qteEntrees, qteVendue, qtePertes, coutPertes }
    - labelPeriode : 'ce mois-ci' | 'cette année'
  Emits :
    - voir-detail-entrees
    - voir-detail-ventes
    - voir-detail-pertes
-->
<template>
  <section class="mouvements-stats">
    <button
      type="button"
      class="mouvements-stats__card mouvements-stats__card--vert mouvements-stats__card--bouton"
      @click="$emit('voir-detail-entrees')"
    >
      <p class="mouvements-stats__label">Produits entrés · {{ labelPeriode }}</p>
      <p class="mouvements-stats__value">{{ stats.qteEntrees }}</p>
      <p class="mouvements-stats__lien">Voir le détail →</p>
    </button>

    <button
      type="button"
      class="mouvements-stats__card mouvements-stats__card--tan mouvements-stats__card--bouton"
      @click="$emit('voir-detail-ventes')"
    >
      <p class="mouvements-stats__label">Produits vendus · {{ labelPeriode }}</p>
      <p class="mouvements-stats__value">{{ stats.qteVendue }}</p>
      <p class="mouvements-stats__lien mouvements-stats__lien--tan">Voir le détail →</p>
    </button>

    <button
      type="button"
      class="mouvements-stats__card mouvements-stats__card--burgundy mouvements-stats__card--bouton"
      @click="$emit('voir-detail-pertes')"
    >
      <p class="mouvements-stats__label">Pertes (casse) · {{ labelPeriode }}</p>
      <p class="mouvements-stats__value">{{ stats.qtePertes }}</p>
      <p class="mouvements-stats__lien mouvements-stats__lien--burgundy">Voir le détail →</p>
    </button>

    <button
      type="button"
      class="mouvements-stats__card mouvements-stats__card--burgundy mouvements-stats__card--bouton"
      @click="$emit('voir-detail-pertes')"
    >
      <p class="mouvements-stats__label">Coût des pertes · {{ labelPeriode }}</p>
      <p class="mouvements-stats__value">{{ formatCFA(stats.coutPertes) }}</p>
      <p class="mouvements-stats__lien mouvements-stats__lien--burgundy">Voir le détail →</p>
    </button>
  </section>
</template>

<script setup>
import { formatCFA } from '../../utils/format';

defineProps({
  stats: { type: Object, required: true },
  labelPeriode: { type: String, required: true },
});

defineEmits(['voir-detail-entrees', 'voir-detail-ventes', 'voir-detail-pertes']);
</script>

<style scoped>
.mouvements-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  padding: 0 var(--space-xl) var(--space-lg);
}

.mouvements-stats__card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.mouvements-stats__card--bouton {
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  width: 100%;
}

.mouvements-stats__card--bouton:hover {
  filter: brightness(0.97);
}

.mouvements-stats__card--vert { border-left: 4px solid var(--color-green); }
.mouvements-stats__card--tan { border-left: 4px solid var(--color-tan); }
.mouvements-stats__card--burgundy { border-left: 4px solid var(--color-burgundy); }

.mouvements-stats__label {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
}

.mouvements-stats__value {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 19px;
  color: var(--color-ink);
}

.mouvements-stats__lien {
  margin: 4px 0 0;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--color-green);
}

.mouvements-stats__lien--tan { color: var(--color-tan); }
.mouvements-stats__lien--burgundy { color: var(--color-burgundy); }
</style>