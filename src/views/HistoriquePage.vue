<!--
  HistoriquePage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/historique".
  - Sélecteur de date + tri : par défaut, AUJOURD'HUI (pas tout
    l'historique) — les deux tableaux ci-dessous raisonnent par
    jour. Le bouton "Toutes les dates" reste disponible pour
    consulter l'historique complet si besoin. Le bouton d'ordre
    inverse plus récent/plus ancien.
  - Deux tableaux côte à côte :
      "Entrée"  : UNIQUEMENT les réceptions de stock du jour
                  choisi. Aucune entrée ce jour-là -> tableau vide.
      "Sorties" : tous les produits vendus + toutes les casses
                  signalées ce jour-là.
  - Les cartes KPI (Entrées/Sorties/Dernière activité) portent sur
    le MÊME jour que les deux tableaux (dateChoisie) — pas sur la
    date réelle du jour : si le gérant choisit un autre jour, les
    cartes changent avec lui.
  - Un troisième tableau, "Résultats de la recherche", apparaît EN
    DESSOUS dès qu'un filtre (produit, période OU type) est actif.
-->
<template>
  <GerantPageTemplate>
    <HistoriqueHeader role="Gérant" :nom="session.nomUtilisateur.value" :kpis="kpis" />

    <HistoriqueFilters
      v-model:produit="produitChoisi"
      v-model:periode="periodeChoisie"
      v-model:type="typeChoisi"
      :options-produit="optionsProduit"
    />

    <div class="historique-page__barre-date">
      <label class="historique-page__date-label">
        Jour :
        <input type="date" class="historique-page__date-input" v-model="dateChoisie">
      </label>
      <button
        v-if="dateChoisie"
        type="button"
        class="historique-page__date-reset"
        @click="dateChoisie = ''"
      >
        Toutes les dates
      </button>
      <button type="button" class="historique-page__tri-bouton" @click="basculerOrdre">
        {{ ordreTri === 'desc' ? 'Plus récent d\'abord' : 'Plus ancien d\'abord' }} ↕
      </button>
    </div>

    <p v-if="erreurActivite" class="historique-page__erreur">{{ erreurActivite }}</p>

    <section class="historique-page__deux-colonnes">
      <div class="historique-page__colonne">
        <p class="historique-page__colonne-titre">Entrée</p>
        <HistoriqueTable :mouvements="entrees" />
      </div>
      <div class="historique-page__colonne">
        <p class="historique-page__colonne-titre">Sorties</p>
        <HistoriqueTable :mouvements="ventesEtAutres" />
      </div>
    </section>

    <section v-if="rechercheActive" class="historique-page__resultats">
      <p class="historique-page__colonne-titre">Résultats de la recherche</p>
      <HistoriqueTable :mouvements="resultatsRecherche" />
    </section>
  </GerantPageTemplate>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import HistoriqueHeader from '../components/organisms/HistoriqueHeader.vue';
import HistoriqueFilters from '../components/organisms/HistoriqueFilters.vue';
import HistoriqueTable from '../components/organisms/HistoriqueTable.vue';
import { get } from '../services/api';
import { useSession } from '../store/session';

const session = useSession();

// Historique complet — entrées/casses (mouvements) + ventes.
const mouvementsBruts = ref([]);
const ventesBrutes = ref([]);
const erreurActivite = ref('');

async function chargerActivite() {
  erreurActivite.value = '';
  try {
    const [mvts, vts] = await Promise.all([
      get(`/mouvements/${encodeURIComponent(session.nomEntreprise.value)}`),
      get(`/ventes/${encodeURIComponent(session.nomEntreprise.value)}`),
    ]);
    mouvementsBruts.value = mvts;
    ventesBrutes.value = vts;
  } catch (erreur) {
    erreurActivite.value = erreur.message;
  }
}

onMounted(chargerActivite);

const TYPE_LABELS = { entree: 'Entrée', sortie: 'Vente', casse: 'Casse' };

function formatDate(dateIso) {
  return new Date(dateIso).toLocaleDateString('fr-FR');
}

function formatHeure(dateIso) {
  return new Date(dateIso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// Format YYYY-MM-DD en heure LOCALE (pas UTC), pour comparer
// exactement avec la date choisie dans le sélecteur <input type="date">
// sans décalage de fuseau horaire.
function versDateLocaleISO(dateIso) {
  const d = new Date(dateIso);
  const annee = d.getFullYear();
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const jour = String(d.getDate()).padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

// Lundi 00:00 de la semaine de la date donnée (heure locale).
function debutSemaine(reference) {
  const d = new Date(reference);
  const jour = d.getDay(); // 0 = dimanche ... 6 = samedi
  const diff = (jour === 0 ? -6 : 1) - jour; // lundi = premier jour
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// -------------------------------------------------------------
// Sélecteur de jour + ordre de tri.
// -------------------------------------------------------------
// Par défaut : AUJOURD'HUI (les tableaux "Entrée"/"Sorties"
// raisonnent par jour) — '' = toutes les dates, choisi via le
// bouton "Toutes les dates".
const dateChoisie = ref(versDateLocaleISO(new Date()));
const ordreTri = ref('desc'); // 'desc' = plus récent d'abord

function basculerOrdre() {
  ordreTri.value = ordreTri.value === 'desc' ? 'asc' : 'desc';
}

function correspondALaDateChoisie(dateIso) {
  return !dateChoisie.value || versDateLocaleISO(dateIso) === dateChoisie.value;
}

function trierParDate(liste) {
  return [...liste].sort((a, b) =>
    ordreTri.value === 'desc'
      ? new Date(b.dateIso) - new Date(a.dateIso)
      : new Date(a.dateIso) - new Date(b.dateIso)
  );
}

// Entrées de stock (réceptions) du jour choisi — tableau "Entrée".
// Aucune entrée ce jour-là -> liste vide (le tableau l'affiche
// alors comme "Aucun mouvement ne correspond à ces filtres.").
const entrees = computed(() =>
  trierParDate(
    mouvementsBruts.value
      .filter((m) => m.type === 'entree' && correspondALaDateChoisie(m.dateMouvement))
      .map((m) => ({
        produit: m.produit?.nom || '—',
        type: m.type,
        typeLabel: TYPE_LABELS.entree,
        quantite: m.quantite,
        date: formatDate(m.dateMouvement),
        heure: formatHeure(m.dateMouvement),
        utilisateur: m.vendeur?.nomPrenoms || 'Gérant',
        dateIso: m.dateMouvement,
      }))
  )
);

// Casses signalées le jour choisi, mises en forme comme les autres lignes.
const casses = computed(() =>
  mouvementsBruts.value
    .filter((m) => m.type === 'casse' && correspondALaDateChoisie(m.dateMouvement))
    .map((m) => ({
      produit: m.produit?.nom || '—',
      type: m.type,
      typeLabel: TYPE_LABELS.casse,
      quantite: m.quantite,
      date: formatDate(m.dateMouvement),
      heure: formatHeure(m.dateMouvement),
      utilisateur: m.vendeur?.nomPrenoms || 'Gérant',
      dateIso: m.dateMouvement,
    }))
);

// Ventes du jour choisi, mises en forme comme les autres lignes.
const ventesMisesEnForme = computed(() =>
  ventesBrutes.value
    .filter((v) => correspondALaDateChoisie(v.dateVente))
    .map((v) => ({
      produit: v.produit?.nom || '—',
      type: 'sortie',
      typeLabel: TYPE_LABELS.sortie,
      quantite: v.quantite,
      date: formatDate(v.dateVente),
      heure: formatHeure(v.dateVente),
      utilisateur: v.vendeur?.nomPrenoms || 'Gérant',
      dateIso: v.dateVente,
    }))
);

// Sorties (ventes + casses) du jour choisi — tableau "Sorties".
const ventesEtAutres = computed(() => trierParDate([...ventesMisesEnForme.value, ...casses.value]));

// Tout confondu POUR LE JOUR CHOISI — sert aux cartes KPI et à la
// recherche. entrees/ventesEtAutres sont déjà filtrés par
// dateChoisie, donc les KPI suivent automatiquement le jour
// sélectionné (avant, ils recalculaient un filtre séparé sur la
// date réelle du jour, ignorant dateChoisie).
const toutesActivites = computed(() => trierParDate([...entrees.value, ...ventesEtAutres.value]));

const kpis = computed(() => {
  const entreesJour = entrees.value;
  const sortiesJour = ventesEtAutres.value;
  const derniereActivite = toutesActivites.value[0];

  return {
    nbEntrees: entreesJour.length,
    qteEntrees: entreesJour.reduce((s, m) => s + m.quantite, 0),
    nbSorties: sortiesJour.length,
    qteSorties: sortiesJour.reduce((s, m) => s + m.quantite, 0),
    derniereActivite: derniereActivite
      ? {
          produit: derniereActivite.produit,
          typeLabel: derniereActivite.typeLabel,
          date: derniereActivite.date,
          heure: derniereActivite.heure,
          utilisateur: derniereActivite.utilisateur,
        }
      : { produit: '—', typeLabel: '—', date: '—', heure: '—', utilisateur: '—' },
  };
});

const produitChoisi = ref('tous');
const periodeChoisie = ref('toute'); // 'toute' | 'jour' | 'semaine' | 'mois'
const typeChoisi = ref('tous');

const optionsProduit = computed(() => {
  const produits = [...new Set(toutesActivites.value.map((m) => m.produit))];
  return [
    { value: 'tous', label: 'Tous les produits' },
    ...produits.map((p) => ({ value: p, label: p })),
  ];
});

// La période choisie s'applique par rapport à MAINTENANT (heure
// locale), indépendamment du sélecteur "Jour" ci-dessus (qui cible
// un jour précis) — les deux peuvent être combinés.
function correspondALaPeriodeChoisie(dateIso) {
  if (periodeChoisie.value === 'toute') return true;

  const date = new Date(dateIso);
  const maintenantRef = new Date();

  if (periodeChoisie.value === 'jour') {
    return versDateLocaleISO(date) === versDateLocaleISO(maintenantRef);
  }
  if (periodeChoisie.value === 'semaine') {
    return date >= debutSemaine(maintenantRef) && date <= maintenantRef;
  }
  if (periodeChoisie.value === 'mois') {
    return date.getFullYear() === maintenantRef.getFullYear() && date.getMonth() === maintenantRef.getMonth();
  }
  return true;
}

// Un filtre est "actif" dès que produit, période ou type ne sont
// plus sur leur valeur par défaut.
const rechercheActive = computed(() =>
  produitChoisi.value !== 'tous' || periodeChoisie.value !== 'toute' || typeChoisi.value !== 'tous'
);

const resultatsRecherche = computed(() =>
  trierParDate(
    toutesActivites.value.filter((m) => {
      const correspondProduit = produitChoisi.value === 'tous' || m.produit === produitChoisi.value;
      const correspondType = typeChoisi.value === 'tous' || m.type === typeChoisi.value;
      const correspondPeriode = correspondALaPeriodeChoisie(m.dateIso);
      return correspondProduit && correspondType && correspondPeriode;
    })
  )
);
</script>

<style scoped>
.historique-page__erreur {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: #b3251d;
  font-style: italic;
}

.historique-page__barre-date {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 var(--space-xl) var(--space-md);
}

.historique-page__date-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--color-ink-muted);
}

.historique-page__date-input {
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  padding: 0 8px;
  font-size: 12.5px;
  color: var(--color-ink);
}

.historique-page__date-reset,
.historique-page__tri-bouton {
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  color: var(--color-ink);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.historique-page__deux-colonnes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  padding: 0 var(--space-xl) var(--space-xl);
}

@media (max-width: 860px) {
  .historique-page__deux-colonnes {
    grid-template-columns: 1fr;
  }
}

.historique-page__colonne-titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-ink);
  margin: 0 0 var(--space-sm);
}

.historique-page__resultats {
  padding: 0 var(--space-xl) var(--space-xl);
}
</style>