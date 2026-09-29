<template>
  <section class="vendeur-stats-row">
    <AlertCard title="Sous le seuil" :message="`${kpis.nbSousSeuil} produit${kpis.nbSousSeuil > 1 ? 's' : ''}`" level="warning" />
    <AlertCard title="En rupture" :message="`${kpis.nbRupture} produit${kpis.nbRupture > 1 ? 's' : ''}`" level="critical" />
    <InfoStatCard title="Le plus vendu" :lines="[kpis.produitPlusVendu.nom, `Quantité : ${kpis.produitPlusVendu.quantite}`]" />
    <InfoStatCard title="Ventes du jour" :lines="[`${kpis.nbVentesJour} produits`]">
      <template #icon>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8C6A2F" stroke-width="2.4"><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M12.5 21h-8a2 2 0 0 1-2-2c0-3 3-6 6-6s6 3 6 6a2 2 0 0 1-2 2Z"/><circle cx="8.5" cy="7" r="4"/></svg>
      </template>
    </InfoStatCard>
  </section>
</template>

<script setup>
import AlertCard from '../molecules/AlertCard.vue';
import InfoStatCard from '../molecules/InfoStatCard.vue';

defineProps({
  kpis: { type: Object, required: true },
});
</script>

<style scoped>
.vendeur-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  padding: 0 var(--space-xl) var(--space-lg);
}
</style>