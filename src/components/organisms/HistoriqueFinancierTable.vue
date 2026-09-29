<!--
  HistoriqueFinancierTable.vue (organism)
  --------------------------------------------------------------
  Rôle : liste chaque période avec ventes, dépenses, bénéfice et
  perte. Chaque colonne numérique est alignée à droite, resserrée.
  Pour Bénéfice/Perte, le pourcentage est une petite bulle COLLÉE
  juste après le montant (pas une colonne séparée) — sa couleur
  varie selon l'intensité du pourcentage (plus le taux est élevé,
  plus la teinte est soutenue).

  Props :
    - periods : [{ label, ventes, depenses }]
-->
<template>
  <div class="historique-financier">
    <table class="historique-financier__table">
      <colgroup>
        <col style="width: 22%;">
        <col style="width: 16%;">
        <col style="width: 16%;">
        <col style="width: 23%;">
        <col style="width: 23%;">
      </colgroup>
      <thead>
        <tr>
          <th>Période</th>
          <th class="historique-financier__num">Ventes</th>
          <th class="historique-financier__num">Dépenses</th>
          <th class="historique-financier__num">Bénéfice</th>
          <th class="historique-financier__num">Perte</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.label">
          <td>{{ row.label }}</td>
          <td class="historique-financier__num">{{ formatCFA(row.ventes) }}</td>
          <td class="historique-financier__num">{{ formatCFA(row.depenses) }}</td>

          <td class="historique-financier__num">
            <span v-if="row.benefice > 0" class="historique-financier__cellule">
              <span class="historique-financier__montant historique-financier__montant--positif">
                +{{ formatCFA(row.benefice) }}
              </span>
              <span
                class="historique-financier__pct historique-financier__pct--positif"
                :style="{ background: couleurPct(row.pourcentageBenefice, true) }"
              >
                {{ row.pourcentageBenefice }}%
              </span>
            </span>
            <span v-else class="historique-financier__tiret">—</span>
          </td>

          <td class="historique-financier__num">
            <span v-if="row.perte > 0" class="historique-financier__cellule">
              <span class="historique-financier__montant historique-financier__montant--negatif">
                −{{ formatCFA(row.perte) }}
              </span>
              <span
                class="historique-financier__pct historique-financier__pct--negatif"
                :style="{ background: couleurPct(row.pourcentagePerte, false) }"
              >
                {{ row.pourcentagePerte }}%
              </span>
            </span>
            <span v-else class="historique-financier__tiret">—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatCFA } from '../../utils/format';

const props = defineProps({
  periods: { type: Array, required: true },
});

const rows = computed(() =>
  [...props.periods]
    .map((p) => {
      const resultat = p.ventes - p.depenses;
      const benefice = resultat > 0 ? resultat : 0;
      const perte = resultat < 0 ? Math.abs(resultat) : 0;

      return {
        ...p,
        benefice,
        perte,
        pourcentageBenefice: p.ventes === 0 ? 0 : Math.round((benefice / p.ventes) * 100),
        pourcentagePerte: p.ventes === 0 ? 0 : Math.round((perte / p.ventes) * 100),
      };
    })
    .reverse()
);

// La teinte de la bulle varie selon l'intensité du pourcentage :
// plus le taux est élevé, plus la couleur est soutenue (lightness
// plus basse). Vert pour bénéfice, rouge/burgundy pour perte.
function couleurPct(pourcentage, estBenefice) {
  const intensite = Math.min(pourcentage, 60) / 60; // 0 à 1
  const lightness = 88 - intensite * 30; // 88% (clair) à 58% (soutenu)
  const teinte = estBenefice ? 145 : 6;
  const saturation = estBenefice ? 30 : 55;
  return `hsl(${teinte}, ${saturation}%, ${lightness}%)`;
}
</script>

<style scoped>
.historique-financier {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-sm) var(--space-lg);
  margin: 0 var(--space-xl);
  box-sizing: border-box;
  overflow-x: auto;
}

.historique-financier__table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 12px;
}

.historique-financier__table th {
  text-align: left;
  padding: var(--space-sm) 6px;
  color: var(--color-ink-muted);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
}

.historique-financier__table td {
  padding: 7px 6px;
  border-bottom: 1px solid var(--color-bg-panel-muted);
}

.historique-financier__num {
  text-align: right;
}

.historique-financier__cellule {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.historique-financier__montant {
  font-weight: 600;
}

.historique-financier__montant--positif { color: #233F1E; }
.historique-financier__montant--negatif { color: #6E2116; }

.historique-financier__pct {
  display: inline-block;
  border-radius: 999px;
  padding: 1px 7px;
  font-size: 10.5px;
  font-weight: 700;
}

.historique-financier__pct--positif { color: #1E3A19; }
.historique-financier__pct--negatif { color: #5E1A10; }

.historique-financier__tiret {
  color: var(--color-ink-muted);
}

.historique-financier__table th.historique-financier__num {
  text-align: right;
}
</style>