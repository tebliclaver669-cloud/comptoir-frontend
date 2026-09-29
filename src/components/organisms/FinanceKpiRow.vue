<!--
  FinanceKpiRow.vue (organism)
  --------------------------------------------------------------
  Rôle : cartes résumé de la page Statistiques : chiffre d'affaires,
  dépenses totales, bénéfice (montant + %), perte (montant + %),
  meilleure période.

  Props :
    - kpis : { caTotal, depensesTotal, totalBenefice, pourcentageBenefice,
               totalPerte, pourcentagePerte,
               meilleurePeriode: { label, montant },
               labelPeriode: string }
-->
<template>
  <section class="finance-kpi-row">
    <ValeurStockCard :label="`Chiffre d'affaires (${kpis.labelPeriode})`" :value="formatCFA(kpis.caTotal)" />
    <ValeurStockCard label="Dépenses totales" :value="formatCFA(kpis.depensesTotal)" />
    <BeneficeCard
      label="Bénéfice"
      :montant="kpis.totalBenefice"
      :pourcentage="kpis.pourcentageBenefice"
      variante="positif"
    />
    <BeneficeCard
      label="Perte"
      :montant="kpis.totalPerte"
      :pourcentage="kpis.pourcentagePerte"
      variante="negatif"
    />
    <InfoStatCard
      title="Meilleure période"
      :lines="[kpis.meilleurePeriode.label, `+${formatCFA(kpis.meilleurePeriode.montant)}`]"
    />
  </section>
</template>

<script setup>
import ValeurStockCard from '../molecules/ValeurStockCard.vue';
import BeneficeCard from '../molecules/BeneficeCard.vue';
import InfoStatCard from '../molecules/InfoStatCard.vue';
import { formatCFA } from '../../utils/format';

defineProps({
  kpis: { type: Object, required: true },
});
</script>

<style scoped>
.finance-kpi-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-md);
  padding: 0 var(--space-xl) var(--space-lg);
}
</style>