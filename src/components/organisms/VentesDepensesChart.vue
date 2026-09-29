<!--
  VentesDepensesChart.vue (organism)
  --------------------------------------------------------------
  Rôle : graphique en barres groupées (ventes vs dépenses) par
  période. Au survol, une info-bulle animée montre le taux de
  ventes/dépenses de ce mois/année. La période actuellement
  sélectionnée dans MoisSelect/AnneeSelect (periodeSurbrillance)
  est marquée en permanence par une couleur de fond distincte, pas
  seulement au survol.

  Props :
    - periods : [{ label, ventes, depenses }]
    - periodeSurbrillance : label de la période à mettre en avant
      (ex. 'Juillet' ou '2026') — doit correspondre exactement à un
      des `label` de periods pour matcher
-->
<template>
  <div class="ventes-depenses-chart">
    <div class="ventes-depenses-chart__header">
      <p class="ventes-depenses-chart__title">Ventes · dépenses par période</p>
      <div class="ventes-depenses-chart__legend">
        <span class="ventes-depenses-chart__legend-item">
          <span class="ventes-depenses-chart__dot ventes-depenses-chart__dot--ventes" />Ventes
        </span>
        <span class="ventes-depenses-chart__legend-item">
          <span class="ventes-depenses-chart__dot ventes-depenses-chart__dot--depenses" />Dépenses
        </span>
        <span class="ventes-depenses-chart__legend-item">
          <span class="ventes-depenses-chart__dot ventes-depenses-chart__dot--selection" />Période choisie
        </span>
      </div>
    </div>

    <div class="ventes-depenses-chart__bars">
      <div
        v-for="p in periodsAvecTaux"
        :key="p.label"
        class="ventes-depenses-chart__group"
        :class="{ 'ventes-depenses-chart__group--selectionne': p.label === periodeSurbrillance }"
        @mouseenter="groupeSurvole = p.label"
        @mouseleave="groupeSurvole = null"
      >
        <div class="ventes-depenses-chart__tooltip" :class="{ 'ventes-depenses-chart__tooltip--visible': groupeSurvole === p.label }">
          <p class="ventes-depenses-chart__tooltip-titre">{{ p.label }}</p>
          <p class="ventes-depenses-chart__tooltip-ligne">Taux de ventes : {{ p.tauxVentes }}%</p>
          <p class="ventes-depenses-chart__tooltip-ligne">Taux de dépenses : {{ p.tauxDepenses }}%</p>
        </div>

        <div class="ventes-depenses-chart__pair" :class="{ 'ventes-depenses-chart__pair--survole': groupeSurvole === p.label }">
          <div
            class="ventes-depenses-chart__bar ventes-depenses-chart__bar--ventes"
            :style="{ height: pct(p.ventes) + '%' }"
          />
          <div
            class="ventes-depenses-chart__bar ventes-depenses-chart__bar--depenses"
            :style="{ height: pct(p.depenses) + '%' }"
          />
        </div>
        <span class="ventes-depenses-chart__label" :class="{ 'ventes-depenses-chart__label--selectionne': p.label === periodeSurbrillance }">
          {{ p.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  periods: { type: Array, required: true },
  periodeSurbrillance: { type: String, default: '' },
});

const groupeSurvole = ref(null);

const maxValeur = computed(() =>
  Math.max(...props.periods.flatMap((p) => [p.ventes, p.depenses]), 1)
);

function pct(valeur) {
  return Math.round((valeur / maxValeur.value) * 100);
}

const periodsAvecTaux = computed(() => {
  const totalVentes = props.periods.reduce((s, p) => s + p.ventes, 0);
  const totalDepenses = props.periods.reduce((s, p) => s + p.depenses, 0);

  return props.periods.map((p) => ({
    ...p,
    tauxVentes: totalVentes === 0 ? 0 : Math.round((p.ventes / totalVentes) * 100),
    tauxDepenses: totalDepenses === 0 ? 0 : Math.round((p.depenses / totalDepenses) * 100),
  }));
});
</script>

<style scoped>
.ventes-depenses-chart {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  margin: 0 var(--space-xl) var(--space-lg);
  box-sizing: border-box;
}

.ventes-depenses-chart__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.ventes-depenses-chart__title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.05em;
  color: var(--color-ink-muted);
}

.ventes-depenses-chart__legend {
  display: flex;
  gap: var(--space-md);
  font-size: 10.5px;
  color: var(--color-ink-muted);
}

.ventes-depenses-chart__legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ventes-depenses-chart__dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.ventes-depenses-chart__dot--ventes { background: var(--color-green); }
.ventes-depenses-chart__dot--depenses { background: var(--color-tan); }
.ventes-depenses-chart__dot--selection { background: var(--color-burgundy); }

.ventes-depenses-chart__bars {
  display: flex;
  align-items: flex-end;
  gap: var(--space-sm);
  height: 140px;
}

.ventes-depenses-chart__group {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: var(--radius-sm);
  padding-top: 6px;
}

.ventes-depenses-chart__group--selectionne {
  background: rgba(140, 53, 39, 0.08);
}

.ventes-depenses-chart__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, 4px) scale(0.92);
  opacity: 0;
  pointer-events: none;
  background: var(--color-navy);
  color: var(--color-cream);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  margin-bottom: 8px;
  white-space: nowrap;
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 5;
}

.ventes-depenses-chart__tooltip--visible {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}

.ventes-depenses-chart__tooltip-titre {
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 11.5px;
}

.ventes-depenses-chart__tooltip-ligne {
  margin: 0;
  font-size: 10.5px;
  color: #B7AF9C;
}

.ventes-depenses-chart__pair {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 110px;
  transition: transform 0.18s ease;
}

.ventes-depenses-chart__pair--survole {
  transform: scale(1.08);
}

.ventes-depenses-chart__bar {
  width: 11px;
  border-radius: 2px 2px 0 0;
  transition: filter 0.18s ease;
}

.ventes-depenses-chart__bar--ventes { background: var(--color-green); }
.ventes-depenses-chart__bar--depenses { background: var(--color-tan); }

.ventes-depenses-chart__pair--survole .ventes-depenses-chart__bar {
  filter: brightness(1.1);
}

.ventes-depenses-chart__label {
  font-size: 10px;
  color: var(--color-ink-muted);
}

.ventes-depenses-chart__label--selectionne {
  color: var(--color-burgundy);
  font-weight: 700;
}
</style>