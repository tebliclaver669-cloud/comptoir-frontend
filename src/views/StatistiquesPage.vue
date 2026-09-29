<!--
  StatistiquesPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/statistiques". BRANCHÉ SUR LE VRAI
  BACKEND : mouvements + ventes via GET /mouvements et GET /ventes,
  et la date de création de l'entreprise via
  GET /api/entreprises/:nomEntreprise (createdAt).

  Vue "Mensuel" — MOIS GLISSANTS ANCRÉS SUR L'INSCRIPTION :
  contrairement à un mois calendaire, "Mois 1" va du jour exact de
  l'inscription au même jour le mois suivant (ex. inscription le
  23/09 -> Mois 1 = 23/09 au 22/10, complet le 23/10). Seuls les
  mois ENTIÈREMENT écoulés apparaissent dans le sélecteur — le mois
  en cours, pas encore complet, n'apparaît pas tant qu'il n'est pas
  terminé. Chaque option affiche à la fois le numéro et la plage de
  dates ("Mois 1 (23 sept. – 22 oct.)").

  Vue "Annuel" — inchangée : compare le total de chaque année
  calendaire réelle depuis la création jusqu'à maintenant.
-->
<template>
  <GerantPageTemplate>
    <header class="statistiques-page__header">
      <div>
        <h1 class="statistiques-page__title">Statistiques</h1>
        <p class="statistiques-page__subtitle">Ventes, dépenses et bénéfices depuis la création de votre compte</p>
      </div>
      <div class="statistiques-page__controles">
        <MoisSelect v-if="periode === 'mensuel'" v-model="moisSelectionne" :options="moisDisponibles" />
        <AnneeSelect v-if="periode === 'annuel'" v-model="anneeSelectionnee" :annees-disponibles="anneesDisponibles" />
        <PeriodeToggle v-model="periode" />
      </div>
    </header>

    <p v-if="erreur" class="statistiques-page__erreur">{{ erreur }}</p>
    <p v-else-if="periode === 'mensuel' && moisDisponibles.length === 0" class="statistiques-page__info">
      Aucun mois complet depuis l'inscription pour l'instant — le premier mois se termine le
      {{ dateFinPremierMois }}.
    </p>

    <FinanceKpiRow :kpis="kpis" />
    <VentesDepensesChart :periods="periodesAffichees" :periode-surbrillance="periodeSurbrillance" />

    <MouvementsStatsCard
      :stats="statsMouvements"
      :label-periode="labelPeriode"
      @voir-detail-entrees="fenetreOuverte = 'entrees'"
      @voir-detail-ventes="fenetreOuverte = 'ventes'"
      @voir-detail-pertes="fenetreOuverte = 'pertes'"
    />

    <DetailEntreesModal
      v-if="fenetreOuverte === 'entrees'"
      :entrees="detailEntrees"
      :label-periode="labelPeriode"
      @fermer="fenetreOuverte = null"
    />

    <DetailVentesModal
      v-if="fenetreOuverte === 'ventes'"
      :ventes="detailVentes"
      :label-periode="labelPeriode"
      @fermer="fenetreOuverte = null"
    />

    <DetailPertesModal
      v-if="fenetreOuverte === 'pertes'"
      :pertes="detailPertes"
      :label-periode="labelPeriode"
      @fermer="fenetreOuverte = null"
    />

    <HistoriqueFinancierTable :periods="periodesAffichees" />
  </GerantPageTemplate>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import PeriodeToggle from '../components/molecules/PeriodeToggle.vue';
import MoisSelect from '../components/molecules/MoisSelect.vue';
import AnneeSelect from '../components/molecules/AnneeSelect.vue';
import FinanceKpiRow from '../components/organisms/FinanceKpiRow.vue';
import VentesDepensesChart from '../components/organisms/VentesDepensesChart.vue';
import HistoriqueFinancierTable from '../components/organisms/HistoriqueFinancierTable.vue';
import MouvementsStatsCard from '../components/organisms/MouvementsStatsCard.vue';
import DetailEntreesModal from '../components/organisms/DetailEntreesModal.vue';
import DetailVentesModal from '../components/organisms/DetailVentesModal.vue';
import DetailPertesModal from '../components/organisms/DetailPertesModal.vue';
import { trouverProduitParNom } from '../store/produits';
import { get } from '../services/api';
import { useSession } from '../store/session';

const session = useSession();

const ANNEE_ACTUELLE = new Date().getFullYear();

// Date exacte d'inscription de l'entreprise (backend, createdAt) —
// null tant qu'elle n'a pas encore été chargée.
const dateCreation = ref(null);

// Activité brute chargée depuis le backend (mouvements + ventes).
const mouvementsBruts = ref([]);
const ventesBrutes = ref([]);
const erreur = ref('');

onMounted(async () => {
  try {
    const [entreprise, mvts, vts] = await Promise.all([
      get(`/entreprises/${encodeURIComponent(session.nomEntreprise.value)}`),
      get(`/mouvements/${encodeURIComponent(session.nomEntreprise.value)}`),
      get(`/ventes/${encodeURIComponent(session.nomEntreprise.value)}`),
    ]);
    dateCreation.value = entreprise.createdAt ? new Date(entreprise.createdAt) : new Date();
    mouvementsBruts.value = mvts;
    ventesBrutes.value = vts;
  } catch (e) {
    erreur.value = e.message;
  }
});

const anneeCreation = computed(() => (dateCreation.value ? dateCreation.value.getFullYear() : ANNEE_ACTUELLE));

const periode = ref('mensuel');
const moisSelectionne = ref('');
const anneeSelectionnee = ref(String(ANNEE_ACTUELLE));

function formatDateCourte(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// Ajoute n mois à une date, en gardant le même jour du mois quand
// c'est possible (ex. 23 septembre + 1 mois = 23 octobre).
function ajouterMois(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

// Date à laquelle le tout premier mois glissant sera complet —
// affichée dans le message "aucun mois complet pour l'instant".
const dateFinPremierMois = computed(() =>
  dateCreation.value ? ajouterMois(dateCreation.value, 1).toLocaleDateString('fr-FR') : '—'
);

// Mois glissants COMPLETS depuis l'inscription : Mois 1 = [date
// d'inscription, +1 mois), Mois 2 = [+1 mois, +2 mois), etc. Le mois
// en cours (pas encore entièrement écoulé) n'apparaît pas.
const moisDisponibles = computed(() => {
  if (!dateCreation.value) return [];

  const maintenant = new Date();
  const liste = [];
  let i = 1;

  while (true) {
    const debut = ajouterMois(dateCreation.value, i - 1);
    const fin = ajouterMois(dateCreation.value, i); // exclusif
    if (fin > maintenant) break;

    const finAffichee = new Date(fin.getTime() - 24 * 60 * 60 * 1000);
    liste.push({
      value: String(i),
      label: `Mois ${i} (${formatDateCourte(debut)} – ${formatDateCourte(finAffichee)})`,
      labelCourt: `Mois ${i}`,
      debut,
      fin,
    });
    i++;
  }

  return liste;
});

// Sélectionne automatiquement le dernier mois complet dès qu'il est
// connu (ou dès qu'un mois de plus devient complet).
watch(
  moisDisponibles,
  (liste) => {
    const valeurs = liste.map((m) => m.value);
    if (!valeurs.includes(moisSelectionne.value)) {
      moisSelectionne.value = liste.length ? liste[liste.length - 1].value : '';
    }
  },
  { immediate: true }
);

const periodeMensuelleSelectionnee = computed(
  () => moisDisponibles.value.find((m) => m.value === moisSelectionne.value) || null
);

// Les années disponibles vont de l'année de création du compte à
// l'année en cours — jamais avant l'inscription sur l'app.
const anneesDisponibles = computed(() => {
  const liste = [];
  for (let a = anneeCreation.value; a <= ANNEE_ACTUELLE; a++) liste.push(String(a));
  return liste;
});

/*
 * -----------------------------------------------------------
 * Toute l'activité (entrées, casses, ventes) mise à plat dans une
 * forme commune, à partir des vraies dates ISO du backend.
 * -----------------------------------------------------------
 */
function moisAnneeLocaux(dateIso) {
  const d = new Date(dateIso);
  return { mois: String(d.getMonth() + 1).padStart(2, '0'), annee: String(d.getFullYear()) };
}

const activites = computed(() => [
  ...mouvementsBruts.value.map((m) => ({
    type: m.type, // 'entree' | 'casse'
    produit: m.produit?.nom || '',
    quantite: m.quantite,
    dateIso: m.dateMouvement,
    utilisateur: m.vendeur?.nomPrenoms || 'Gérant',
  })),
  ...ventesBrutes.value.map((v) => ({
    type: 'sortie',
    produit: v.produit?.nom || '',
    quantite: v.quantite,
    dateIso: v.dateVente,
    utilisateur: v.vendeur?.nomPrenoms || 'Gérant',
  })),
]);

/*
 * -----------------------------------------------------------
 * Vue MENSUEL : un total par mois glissant complet.
 * -----------------------------------------------------------
 */
const donneesMensuellesReelles = computed(() =>
  moisDisponibles.value.map((periode) => {
    let ventes = 0;
    let depenses = 0;

    activites.value.forEach((a) => {
      const d = new Date(a.dateIso);
      if (d < periode.debut || d >= periode.fin) return;

      const produit = trouverProduitParNom(a.produit);
      if (!produit) return;

      if (a.type === 'sortie') ventes += a.quantite * produit.prixVente;
      else if (a.type === 'entree') depenses += a.quantite * produit.prixAchat;
    });

    return { label: periode.labelCourt, ventes, depenses };
  })
);

/*
 * -----------------------------------------------------------
 * Vue ANNUEL : une valeur par année, de la création à aujourd'hui
 * -----------------------------------------------------------
 */
const donneesAnnuellesReelles = computed(() => {
  const totauxParAnnee = {};
  anneesDisponibles.value.forEach((a) => {
    totauxParAnnee[a] = { ventes: 0, depenses: 0 };
  });

  activites.value.forEach((m) => {
    const { annee } = moisAnneeLocaux(m.dateIso);
    if (!totauxParAnnee[annee]) return;

    const produit = trouverProduitParNom(m.produit);
    if (!produit) return;

    if (m.type === 'sortie') {
      totauxParAnnee[annee].ventes += m.quantite * produit.prixVente;
    } else if (m.type === 'entree') {
      totauxParAnnee[annee].depenses += m.quantite * produit.prixAchat;
    }
  });

  return anneesDisponibles.value.map((annee) => ({
    label: annee,
    ventes: totauxParAnnee[annee].ventes,
    depenses: totauxParAnnee[annee].depenses,
  }));
});

const labelPeriode = computed(() => {
  if (periode.value === 'mensuel') {
    const p = periodeMensuelleSelectionnee.value;
    if (!p) return 'sur cette période';
    const finAffichee = new Date(p.fin.getTime() - 24 * 60 * 60 * 1000);
    return `du ${formatDateCourte(p.debut)} au ${formatDateCourte(finAffichee)}`;
  }
  return `en ${anneeSelectionnee.value}`;
});

const periodeSurbrillance = computed(() =>
  periode.value === 'mensuel'
    ? (periodeMensuelleSelectionnee.value ? periodeMensuelleSelectionnee.value.labelCourt : '')
    : anneeSelectionnee.value
);

const periodesAffichees = computed(() =>
  periode.value === 'mensuel' ? donneesMensuellesReelles.value : donneesAnnuellesReelles.value
);

const kpis = computed(() => {
  const data = periodesAffichees.value;
  const caTotal = data.reduce((somme, p) => somme + p.ventes, 0);
  const depensesTotal = data.reduce((somme, p) => somme + p.depenses, 0);

  let totalBenefice = 0;
  let totalPerte = 0;

  data.forEach((p) => {
    const resultat = p.ventes - p.depenses;
    if (resultat >= 0) {
      totalBenefice += resultat;
    } else {
      totalPerte += Math.abs(resultat);
    }
  });

  const pourcentageBenefice = caTotal === 0 ? 0 : Math.round((totalBenefice / caTotal) * 100);
  const pourcentagePerte = caTotal === 0 ? 0 : Math.round((totalPerte / caTotal) * 100);

  const meilleure = data.reduce((max, p) => {
    const beneficeP = p.ventes - p.depenses;
    const beneficeMax = max.ventes - max.depenses;
    return beneficeP > beneficeMax ? p : max;
  }, data[0] || { label: '—', ventes: 0, depenses: 0 });

  return {
    caTotal,
    depensesTotal,
    totalBenefice,
    pourcentageBenefice,
    totalPerte,
    pourcentagePerte,
    meilleurePeriode: { label: meilleure.label, montant: meilleure.ventes - meilleure.depenses },
    labelPeriode: periode.value === 'mensuel' ? labelPeriode.value : `${anneeCreation.value}–${ANNEE_ACTUELLE}`,
  };
});

/*
 * -----------------------------------------------------------
 * Activité filtrée par période choisie (pour les 4 cartes)
 * -----------------------------------------------------------
 */
const activitesFiltrees = computed(() => {
  if (periode.value === 'mensuel') {
    const p = periodeMensuelleSelectionnee.value;
    if (!p) return [];
    return activites.value.filter((a) => {
      const d = new Date(a.dateIso);
      return d >= p.debut && d < p.fin;
    });
  }

  return activites.value.filter((m) => {
    const { annee } = moisAnneeLocaux(m.dateIso);
    return annee === anneeSelectionnee.value;
  });
});

const statsMouvements = computed(() => {
  const filtres = activitesFiltrees.value;

  const qteEntrees = filtres.filter((m) => m.type === 'entree').reduce((s, m) => s + m.quantite, 0);
  const qteVendue = filtres.filter((m) => m.type === 'sortie').reduce((s, m) => s + m.quantite, 0);

  const mouvementsCasse = filtres.filter((m) => m.type === 'casse');
  const qtePertes = mouvementsCasse.reduce((s, m) => s + m.quantite, 0);
  const coutPertes = mouvementsCasse.reduce((s, m) => {
    const produit = trouverProduitParNom(m.produit);
    return s + m.quantite * (produit ? produit.prixAchat : 0);
  }, 0);

  return { qteEntrees, qteVendue, qtePertes, coutPertes };
});

/*
 * -----------------------------------------------------------
 * Détails par carte
 * -----------------------------------------------------------
 */
const fenetreOuverte = ref(null);

const detailEntrees = computed(() =>
  activitesFiltrees.value
    .filter((m) => m.type === 'entree')
    .map((m) => {
      const produit = trouverProduitParNom(m.produit);
      return { produit: m.produit, quantite: m.quantite, fournisseurNom: produit ? produit.fournisseurNom : '' };
    })
);

const detailVentes = computed(() =>
  activitesFiltrees.value
    .filter((m) => m.type === 'sortie')
    .map((m) => ({ produit: m.produit, quantite: m.quantite, utilisateur: m.utilisateur }))
);

const detailPertes = computed(() =>
  activitesFiltrees.value
    .filter((m) => m.type === 'casse')
    .map((m) => {
      const produit = trouverProduitParNom(m.produit);
      const prixAchat = produit ? produit.prixAchat : 0;
      return { produit: m.produit, quantite: m.quantite, utilisateur: m.utilisateur, cout: m.quantite * prixAchat };
    })
);
</script>

<style scoped>
.statistiques-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl) 0;
  margin-bottom: var(--space-lg);
}

.statistiques-page__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.statistiques-page__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 0;
}

.statistiques-page__controles {
  display: flex;
  align-items: center;
  gap: 10px;
}

.statistiques-page__erreur {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: #b3251d;
  font-style: italic;
}

.statistiques-page__info {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: var(--color-ink-muted);
  font-style: italic;
}
</style>