<!--
  AdminVueEnsemblePage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/admin/vue-ensemble". Vue d'ensemble en
  LECTURE SEULE (aucune action de modification) : nombre
  d'entreprises/vendeurs, et les mêmes indicateurs ventes/stock/
  statistiques que le gérant, réutilisés tels quels puisque les
  données mock actuelles sont partagées (un seul jeu de produits
  pour tout le projet, en l'absence de multi-tenant réel).

  Note : tant qu'il n'y a pas de vraie séparation des données par
  entreprise, cette vue affiche les mêmes chiffres que le Tableau
  de bord gérant. Une fois plusieurs entreprises réelles enregistrées
  avec leurs propres produits, cette page devra agréger CHAQUE
  entreprise séparément (somme ou vue par entreprise à sélectionner).

  BRANCHÉ SUR LE VRAI BACKEND : listerEntreprises()/listerTousLes
  Vendeurs() viennent maintenant du serveur (routes /api/admin/...)
  et sont asynchrones -> chargées au montage, pas en synchrone comme
  avant.
-->
<template>
  <GerantPageTemplate role="admin">
    <header class="admin-vue-ensemble__header">
      <h1 class="admin-vue-ensemble__title">Vue d'ensemble</h1>
      <p class="admin-vue-ensemble__subtitle">Lecture seule — aucune modification possible depuis cette vue</p>
    </header>

    <p v-if="messageErreur" class="admin-vue-ensemble__erreur">{{ messageErreur }}</p>

    <div class="admin-vue-ensemble__comptes">
      <div class="admin-vue-ensemble__compte-card">
        <p class="admin-vue-ensemble__compte-label">Entreprises inscrites</p>
        <p class="admin-vue-ensemble__compte-value">{{ nbEntreprises }}</p>
      </div>
      <div class="admin-vue-ensemble__compte-card">
        <p class="admin-vue-ensemble__compte-label">Vendeurs inscrits</p>
        <p class="admin-vue-ensemble__compte-value">{{ nbVendeurs }}</p>
      </div>
    </div>

    <FinanceKpiRow :kpis="kpisFinanciers" />
    <VentesDepensesChart :periods="donneesMensuelles2026" />
    <TauxEcoulementBar :products="products" />

    <section class="admin-vue-ensemble__tables">
      <ProduitsTableauFusionne :products="products" />
    </section>
  </GerantPageTemplate>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import FinanceKpiRow from '../components/organisms/FinanceKpiRow.vue';
import VentesDepensesChart from '../components/organisms/VentesDepensesChart.vue';
import TauxEcoulementBar from '../components/organisms/TauxEcoulementBar.vue';
import ProduitsTableauFusionne from '../components/organisms/ProduitsTableauFusionne.vue';
import { listerEntreprises } from '../store/entreprises';
import { listerTousLesVendeurs } from '../store/vendeurs';

const nbEntreprises = ref(0);
const nbVendeurs = ref(0);
const messageErreur = ref('');

onMounted(async () => {
  try {
    const [entreprises, vendeurs] = await Promise.all([listerEntreprises(), listerTousLesVendeurs()]);
    nbEntreprises.value = entreprises.length;
    nbVendeurs.value = vendeurs.length;
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
});

const products = [
  { nom: 'Riz local 22kg', categorie: 'Alimentation', stockInitial: 60, prixAchatUnitaire: 11000, prixVenteUnitaire: 13500, qteVendue: 22, seuilAlerte: 40 },
  { nom: 'Sucre 1kg', categorie: 'Alimentation', stockInitial: 120, prixAchatUnitaire: 900, prixVenteUnitaire: 1200, qteVendue: 45, seuilAlerte: 60 },
  { nom: 'Eau mineral 1L', categorie: 'Boisson', stockInitial: 90, prixAchatUnitaire: 2000, prixVenteUnitaire: 2500, qteVendue: 90, seuilAlerte: 60 },
  { nom: 'Savon de Marseille', categorie: 'Hygiène & Beauté', stockInitial: 180, prixAchatUnitaire: 350, prixVenteUnitaire: 600, qteVendue: 80, seuilAlerte: 40 },
].map((p) => ({
  ...p,
  prixAchatTotal: p.stockInitial * p.prixAchatUnitaire,
  venteTotal: p.qteVendue * p.prixVenteUnitaire,
  stockFinal: p.stockInitial - p.qteVendue,
}));

const donneesMensuelles2026 = [
  { label: 'Janvier', ventes: 410000, depenses: 300000 },
  { label: 'Février', ventes: 460000, depenses: 330000 },
  { label: 'Mars', ventes: 360000, depenses: 375000 },
  { label: 'Avril', ventes: 500000, depenses: 345000 },
  { label: 'Mai', ventes: 560000, depenses: 360000 },
  { label: 'Juin', ventes: 530000, depenses: 390000 },
  { label: 'Juillet', ventes: 480000, depenses: 410000 },
  { label: 'Août', ventes: 290000, depenses: 315000 },
  { label: 'Septembre', ventes: 575000, depenses: 375000 },
  { label: 'Octobre', ventes: 640000, depenses: 420000 },
  { label: 'Novembre', ventes: 570000, depenses: 435000 },
  { label: 'Décembre', ventes: 750000, depenses: 440000 },
];

const kpisFinanciers = computed(() => {
  const caTotal = donneesMensuelles2026.reduce((s, p) => s + p.ventes, 0);
  const depensesTotal = donneesMensuelles2026.reduce((s, p) => s + p.depenses, 0);
  const meilleure = donneesMensuelles2026.reduce((max, p) =>
    (p.ventes - p.depenses) > (max.ventes - max.depenses) ? p : max
  );

  return {
    caTotal,
    depensesTotal,
    beneficeNet: caTotal - depensesTotal,
    meilleurePeriode: { label: meilleure.label, montant: meilleure.ventes - meilleure.depenses },
    labelPeriode: '2026',
  };
});
</script>

<style scoped>
.admin-vue-ensemble__header {
  padding: var(--space-lg) var(--space-xl) 0;
}

.admin-vue-ensemble__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.admin-vue-ensemble__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 var(--space-lg);
}

.admin-vue-ensemble__erreur {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: #b3251d;
  font-style: italic;
}

.admin-vue-ensemble__comptes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  padding: 0 var(--space-xl) var(--space-lg);
}

.admin-vue-ensemble__compte-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-navy);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.admin-vue-ensemble__compte-label {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
}

.admin-vue-ensemble__compte-value {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 22px;
  color: var(--color-ink);
}

.admin-vue-ensemble__tables {
  padding: 0 var(--space-xl) var(--space-xl);
}
</style>