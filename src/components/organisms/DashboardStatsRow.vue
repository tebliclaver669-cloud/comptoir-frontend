<!--
  DashboardStatsRow.vue (organism)
  --------------------------------------------------------------
  Rôle : assemble ValeurStockCard (réutilisée pour afficher la
  valeur des ventes du jour, optionnelle) + 2x AlertCard +
  3x InfoStatCard. Sur grand écran, les 6 cartes tiennent sur une
  seule ligne à largeur égale ; en dessous de 980px elles passent à
  la ligne (3, puis 2, puis 1 par ligne) au lieu d'être écrasées.
  Réutilisée à l'IDENTIQUE par le Tableau de bord gérant ET vendeur.
  Chaque carte (sauf Produit le plus vendu) affiche une info-bulle au
  survol avec le détail nom + quantité des produits concernés.

  Props :
    - kpis : { totalVentes (valeur des ventes du jour),
               nbSousSeuil, produitsSousSeuilItems,
               nbRupture, produitsRuptureItems,
               produitPlusVendu: { nom, quantite },
               nbVentesJour, venteJourItems,
               nbCassesJour, casseItems }
    - afficherValeurStock : Boolean, true par défaut — malgré son
      nom (conservé pour éviter de casser les appelants), contrôle
      désormais l'affichage de la carte "Valeur des ventes du jour".
-->
<template>
  <section class="dashboard-stats-row">
    <ValeurStockCard
      v-if="afficherValeurStock"
      label="Valeur des ventes du jour"
      :value="kpis.totalVentes"
      class="dashboard-stats-row__carte"
    />

    <AlertCard
      title="Produits sous le seuil d'alerte"
      :message="`${kpis.nbSousSeuil} produit${kpis.nbSousSeuil > 1 ? 's' : ''} est actuellement sous le seuil`"
      level="warning"
      :items="kpis.produitsSousSeuilItems || []"
      class="dashboard-stats-row__carte"
    />
    <AlertCard
      title="Produits en rupture de stock"
      :message="`${kpis.nbRupture} produit${kpis.nbRupture > 1 ? 's' : ''} est en rupture`"
      level="critical"
      :items="kpis.produitsRuptureItems || []"
      class="dashboard-stats-row__carte"
    />

    <InfoStatCard
      title="Produit le plus vendu"
      :lines="kpis.produitPlusVendu ? [kpis.produitPlusVendu.nom, `Quantité : ${kpis.produitPlusVendu.quantite}`] : []"
      class="dashboard-stats-row__carte"
    />
    <InfoStatCard
      title="vente du jour"
      :lines="kpis.nbVentesJour > 0 ? [`${kpis.nbVentesJour} produit${kpis.nbVentesJour > 1 ? 's' : ''} vendu${kpis.nbVentesJour > 1 ? 's' : ''}`] : []"
      :items="kpis.venteJourItems || []"
      class="dashboard-stats-row__carte"
    />
    <InfoStatCard
      title="Casses du jour"
      :lines="[`${kpis.nbCassesJour || 0} produit${(kpis.nbCassesJour || 0) > 1 ? 's' : ''} cassé${(kpis.nbCassesJour || 0) > 1 ? 's' : ''}`]"
      :items="kpis.casseItems || []"
      class="dashboard-stats-row__carte"
    />
  </section>
</template>

<script setup>
import ValeurStockCard from '../molecules/ValeurStockCard.vue';
import AlertCard from '../molecules/AlertCard.vue';
import InfoStatCard from '../molecules/InfoStatCard.vue';

defineProps({
  kpis: { type: Object, required: true },
  afficherValeurStock: { type: Boolean, default: true },
});
</script>

<style scoped>
/*
  Sur grand écran : 6 cartes sur une seule ligne, largeur égale.
  Sous ~980px : plus de place pour 6 colonnes sans écraser le texte
  -> on laisse les cartes passer à la ligne (flex-wrap: wrap) au lieu
  de les comprimer, et chaque carte (voir ValeurStockCard/AlertCard/
  InfoStatCard) grandit avec son contenu (min-height, pas height fixe)
  au lieu de laisser le texte déborder par-dessus ses voisines.
*/
.dashboard-stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 var(--space-xl) var(--space-lg);
  align-items: stretch;
}

.dashboard-stats-row__carte {
  flex: 1 1 150px;
  min-width: 150px;
  min-height: 104px;
}

@media (max-width: 980px) {
  .dashboard-stats-row__carte {
    flex-basis: calc(33.333% - 10px);
  }
}

@media (max-width: 640px) {
  .dashboard-stats-row__carte {
    flex-basis: calc(50% - 10px);
  }
}

@media (max-width: 400px) {
  .dashboard-stats-row__carte {
    flex-basis: 100%;
  }
}
</style>