<!--
  TableauDeBordVendeurPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/tableau-de-bord-vendeur". Produits depuis
  le store partagé (backend). Ventes et casses du jour lues
  DIRECTEMENT depuis le backend (GET /ventes, GET /mouvements).
  "Part des ventes du jour" utilise le même composant que le gérant.

  Le tableau fusionné utilise ProduitsTableauFusionneVendeur (SANS
  colonne Dépenses — le prix d'achat est réservé au gérant, déjà
  visible dans son propre Approvisionnement) et n'affiche QUE les
  produits réellement vendus aujourd'hui. Les KPI restent calculés
  sur TOUT le catalogue.

  Casses : le tableau "Mes casses signalées" a été retiré — toutes
  ces infos (produit, quantité, date/heure, signalé par) apparaissent
  maintenant dans l'info-bulle de la carte "Casses du jour" (au
  survol, voir DashboardStatsRow/InfoStatCard), pour toutes les
  casses du jour (pas seulement celles signalées par ce vendeur —
  même périmètre que les autres KPI, qui portent sur toute
  l'activité du jour).
-->
<template>
  <GerantPageTemplate role="vendeur">
    <DashboardHeader
      :date="dateActuelle()"
      titre="Tableau de Bord"
      sous-titre="Vue d'ensemble du stock, des ruptures et des ventes du jour"
      role="Vendeur"
      :nom="session.nomUtilisateur.value"
    />

    <p v-if="chargement" class="tableau-de-bord-vendeur__info">Chargement de l'activité du jour…</p>
    <p v-if="erreur" class="tableau-de-bord-vendeur__erreur">{{ erreur }}</p>

    <DashboardStatsRow :kpis="kpis" />

    <div class="tableau-de-bord-vendeur__part-ventes">
      <PartVentesJourBar :products="produitsAvecBilan" />
    </div>

    <section class="tableau-de-bord-vendeur__tables">
      <ProduitsTableauFusionneVendeur :products="produitsVendusAujourdHui" />
    </section>

    <div class="tableau-de-bord-vendeur__vente-remise">
      <VenteTotalRemiseCard :total="kpis.totalVentes" :remise="kpis.totalRemises" />
    </div>
  </GerantPageTemplate>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import DashboardHeader from '../components/organisms/DashboardHeader.vue';
import DashboardStatsRow from '../components/organisms/DashboardStatsRow.vue';
import PartVentesJourBar from '../components/organisms/PartVentesJourBar.vue';
import ProduitsTableauFusionneVendeur from '../components/organisms/ProduitsTableauFusionneVendeur.vue';
import VenteTotalRemiseCard from '../components/organisms/VenteTotalRemiseCard.vue';
import { listerProduits } from '../store/produits';
import { get } from '../services/api';
import { useSession } from '../store/session';

const session = useSession();
const produits = listerProduits(); // liste partagée, déjà chargée par GerantPageTemplate

function dateActuelle() {
  const maintenant = new Date();
  const jour = String(maintenant.getDate()).padStart(2, '0');
  const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
  return `${jour}/${mois}/${maintenant.getFullYear()}`;
}

function heureDe(dateIso) {
  return new Date(dateIso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

const ventes = ref([]);
const mouvements = ref([]);
const chargement = ref(true);
const erreur = ref('');

async function chargerActivite() {
  chargement.value = true;
  erreur.value = '';
  try {
    const [ventesBackend, mouvementsBackend] = await Promise.all([
      get(`/ventes/${encodeURIComponent(session.nomEntreprise.value)}`),
      get(`/mouvements/${encodeURIComponent(session.nomEntreprise.value)}`),
    ]);
    ventes.value = ventesBackend;
    mouvements.value = mouvementsBackend;
  } catch (e) {
    erreur.value = e.message;
  } finally {
    chargement.value = false;
  }
}

onMounted(chargerActivite);

function estAujourdHui(dateIso) {
  return new Date(dateIso).toLocaleDateString('fr-FR') === dateActuelle();
}

const ventesDuJour = computed(() => ventes.value.filter((v) => estAujourdHui(v.dateVente)));
const cassesDuJour = computed(() =>
  mouvements.value.filter((m) => m.type === 'casse' && estAujourdHui(m.dateMouvement))
);

const produitsAvecBilan = computed(() =>
  produits.map((p) => {
    const ventesProduit = ventesDuJour.value.filter((v) => v.produitId === p.id);
    const qteVendue = ventesProduit.reduce((s, v) => s + v.quantite, 0);
    const venteTotal = ventesProduit.reduce((s, v) => s + v.total, 0);
    const qteCassee = cassesDuJour.value
      .filter((m) => m.produitId === p.id)
      .reduce((s, m) => s + m.quantite, 0);

    const stockInitial = p.stock + qteVendue + qteCassee;

    return {
      nom: p.nom,
      categorie: p.categorie,
      stockInitial,
      prixAchatUnitaire: p.prixAchat,
      prixAchatTotal: stockInitial * p.prixAchat,
      prixVenteUnitaire: p.prixVente,
      qteVendue,
      venteTotal,
      qteCasse: qteCassee,
      seuilAlerte: p.seuilAlerte,
      stockFinal: p.stock,
    };
  })
);

const produitsVendusAujourdHui = computed(() =>
  produitsAvecBilan.value.filter((p) => p.qteVendue > 0)
);

// Détail des casses du jour, mis en forme pour l'info-bulle de la
// carte "Casses du jour" (produit, quantité, heure, signalé par —
// tout ce qui était affiché dans l'ancien tableau "Mes casses
// signalées", qui est retiré).
const casseItems = computed(() =>
  cassesDuJour.value.map(
    (m) => `${m.produit?.nom || '—'} × ${m.quantite} — ${heureDe(m.dateMouvement)} (${m.vendeur?.nomPrenoms || 'Gérant'})`
  )
);

// Détail des produits sous le seuil d'alerte et en rupture, pour les
// info-bulles des cartes correspondantes (survol).
const produitsSousSeuilItems = computed(() =>
  produitsAvecBilan.value
    .filter((p) => p.stockFinal > 0 && p.stockFinal <= p.seuilAlerte)
    .map((p) => `${p.nom} — Stock : ${p.stockFinal} (seuil : ${p.seuilAlerte})`)
);
const produitsRuptureItems = computed(() =>
  produitsAvecBilan.value.filter((p) => p.stockFinal === 0).map((p) => p.nom)
);

const kpis = computed(() => {
  const bilans = produitsAvecBilan.value;

  const nbSousSeuil = bilans.filter((p) => p.stockFinal > 0 && p.stockFinal <= p.seuilAlerte).length;
  const nbRupture = bilans.filter((p) => p.stockFinal === 0).length;
  const produitsVendus = bilans.filter((p) => p.qteVendue > 0);
  const produitPlusVendu = produitsVendus.length
    ? produitsVendus.reduce((max, p) => (p.qteVendue > max.qteVendue ? p : max))
    : null;
  const totalVentes = ventesDuJour.value.reduce((s, v) => s + v.total, 0);
  // Somme des remises réellement appliquées aux ventes du jour
  // (chaque Vente porte sa propre part, cf. store/panier.js).
  const totalRemises = ventesDuJour.value.reduce((s, v) => s + (v.remise || 0), 0);

  return {
    nbSousSeuil,
    nbRupture,
    produitPlusVendu: produitPlusVendu
      ? { nom: produitPlusVendu.nom, quantite: produitPlusVendu.qteVendue }
      : null,
    nbVentesJour: produitsVendus.length,
    totalVentes,
    totalRemises,
    nbCassesJour: cassesDuJour.value.length,
    casseItems: casseItems.value,
    produitsSousSeuilItems: produitsSousSeuilItems.value,
    produitsRuptureItems: produitsRuptureItems.value,
  };
});
</script>

<style scoped>
.tableau-de-bord-vendeur__part-ventes {
  padding: 0 var(--space-xl) var(--space-lg);
}

.tableau-de-bord-vendeur__tables {
  padding: 0 var(--space-xl) var(--space-lg);
}

.tableau-de-bord-vendeur__vente-remise {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-md) var(--space-xl) 0;
}

.tableau-de-bord-vendeur__info {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: var(--color-ink-muted);
  font-style: italic;
}

.tableau-de-bord-vendeur__erreur {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: #b3251d;
  font-style: italic;
}
</style>