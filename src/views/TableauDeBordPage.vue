<!--
  TableauDeBordPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/tableau-de-bord". Produits depuis le
  store partagé (déjà synchronisé avec le backend, chargé par
  GerantPageTemplate). Ventes et casses du jour lues DIRECTEMENT
  depuis le backend (GET /ventes, GET /mouvements) — le store
  localStorage mouvements.js n'est plus alimenté par les vraies
  ventes du panier, donc ce tableau restait vide sans ce fix.

  Le tableau fusionné (ProduitsTableauFusionne) n'affiche QUE les
  produits réellement vendus aujourd'hui. Les KPI (ruptures, seuils
  bas, produit le plus vendu) restent calculés sur TOUT le
  catalogue.
-->
<template>
  <GerantPageTemplate>
    <DashboardHeader
      :date="dateActuelle()"
      titre="Tableau de Bord"
      sous-titre="Vue d'ensemble du stock, des ruptures et des ventes du jour"
      :role="capitaliser(session.role.value)"
      :nom="session.nomUtilisateur.value"
    />

    <p v-if="chargement" class="tableau-de-bord__info">Chargement de l'activité du jour…</p>
    <p v-if="erreur" class="tableau-de-bord__erreur">{{ erreur }}</p>

    <DashboardStatsRow :kpis="kpis" />

    <div class="tableau-de-bord__part-ventes">
      <PartVentesJourBar :products="produitsAvecBilan" />
    </div>

    <section class="tableau-de-bord__tables">
      <ProduitsTableauFusionne :products="produitsVendusAujourdHui" />
    </section>

    <div class="tableau-de-bord__vente-remise">
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
import ProduitsTableauFusionne from '../components/organisms/ProduitsTableauFusionne.vue';
import VenteTotalRemiseCard from '../components/organisms/VenteTotalRemiseCard.vue';
import { listerProduits } from '../store/produits';
import { get } from '../services/api';
import { useSession } from '../store/session';

const session = useSession();
const produits = listerProduits(); // liste partagée, déjà chargée par GerantPageTemplate

function capitaliser(mot) {
  return mot ? mot.charAt(0).toUpperCase() + mot.slice(1) : '';
}

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

// Bilan du jour pour TOUT le catalogue — sert aux KPI (ruptures,
// seuils bas), qui doivent couvrir l'ensemble du stock, vendu ou non.
const produitsAvecBilan = computed(() =>
  produits.map((p) => {
    const ventesProduit = ventesDuJour.value.filter((v) => v.produitId === p.id);
    const qteVendue = ventesProduit.reduce((s, v) => s + v.quantite, 0);
    const venteTotal = ventesProduit.reduce((s, v) => s + v.total, 0);
    const qteCassee = cassesDuJour.value
      .filter((m) => m.produitId === p.id)
      .reduce((s, m) => s + m.quantite, 0);

    // p.stock est le stock ACTUEL (backend, déjà net des ventes et
    // casses du jour) -> le stock de DÉBUT de journée s'obtient en
    // rajoutant ce qui est sorti aujourd'hui.
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
      seuilAlerte: p.seuilAlerte,
      stockFinal: p.stock,
    };
  })
);

const produitsVendusAujourdHui = computed(() =>
  produitsAvecBilan.value.filter((p) => p.qteVendue > 0)
);

// Détail des casses du jour (toutes, quel que soit le vendeur qui les
// a signalées), pour l'info-bulle de la carte "Casses du jour" —
// produit, quantité, heure, signalé par.
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
.tableau-de-bord__part-ventes {
  padding: 0 var(--space-xl) var(--space-lg);
}

.tableau-de-bord__tables {
  padding: 0 var(--space-xl);
}

.tableau-de-bord__vente-remise {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-md) var(--space-xl) 0;
}

.tableau-de-bord__info {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: var(--color-ink-muted);
  font-style: italic;
}

.tableau-de-bord__erreur {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: #b3251d;
  font-style: italic;
}
</style>