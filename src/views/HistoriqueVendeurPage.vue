<!--
  HistoriqueVendeurPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/historique-vendeur". Même mise en page que
  côté gérant :
  - Sélecteur de date + tri : par défaut, AUJOURD'HUI (pas tout
    l'historique) — les deux tableaux raisonnent par jour. Le
    bouton "Toutes les dates" reste disponible.
  - Deux tableaux côte à côte :
      "Entrée"  : réceptions de stock du jour — TOUTES les entrées de
                  l'entreprise, pas seulement celles "de ce vendeur" :
                  les entrées sont toujours faites par le gérant, elles
                  n'ont jamais de vendeur associé (avant, le filtre
                  estCeVendeur(m.vendeur) rendait cette colonne
                  structurellement vide en permanence, quel que soit
                  le vendeur connecté).
      "Sorties" : ventes + casses signalées par CE vendeur ce
                  jour-là (ça, oui, ça reste filtré par vendeur).
  - Les cartes KPI (Entrées/Sorties/Dernière activité) suivent le
    jour choisi (dateChoisie), pas la date réelle du jour — même
    correctif que côté gérant.
  - "Résultats de la recherche" en dessous, filtre "période" branché.
  - Bouton "Reçu" sur chaque ligne de vente (tableaux "Sorties" et
    "Résultats de la recherche") : réimprime le reçu de cette vente,
    même des semaines après, au cas où un client le redemande.
    N'existe PAS sur le tableau "Entrée" (ce ne sont pas des ventes).
-->
<template>
  <GerantPageTemplate role="vendeur">
    <HistoriqueHeader role="Vendeur" :nom="session.nomUtilisateur.value" :kpis="kpis" />

    <HistoriqueFilters
      v-model:produit="produitChoisi"
      v-model:periode="periodeChoisie"
      v-model:type="typeChoisi"
      :options-produit="optionsProduit"
    />

    <div class="historique-vendeur-page__barre-date">
      <label class="historique-vendeur-page__date-label">
        Jour :
        <input type="date" class="historique-vendeur-page__date-input" v-model="dateChoisie">
      </label>
      <button
        v-if="dateChoisie"
        type="button"
        class="historique-vendeur-page__date-reset"
        @click="dateChoisie = ''"
      >
        Toutes les dates
      </button>
      <button type="button" class="historique-vendeur-page__tri-bouton" @click="basculerOrdre">
        {{ ordreTri === 'desc' ? 'Plus récent d\'abord' : 'Plus ancien d\'abord' }} ↕
      </button>
    </div>

    <p v-if="erreurActivite" class="historique-vendeur-page__erreur">{{ erreurActivite }}</p>

    <section class="historique-vendeur-page__deux-colonnes">
      <div class="historique-vendeur-page__colonne">
        <p class="historique-vendeur-page__colonne-titre">Entrée</p>
        <HistoriqueTable :mouvements="entrees" />
      </div>
      <div class="historique-vendeur-page__colonne">
        <p class="historique-vendeur-page__colonne-titre">Sorties</p>
        <HistoriqueTable :mouvements="ventesEtAutres" avec-recu @imprimer-recu="ouvrirApercuRecu" />
        <button
          v-if="dateChoisie && ventesMisesEnForme.length > 0"
          type="button"
          class="historique-vendeur-page__recu-journalier"
          @click="imprimerRecuJournalier"
        >
          Imprimer reçu journalier
        </button>
      </div>
    </section>

    <section v-if="rechercheActive" class="historique-vendeur-page__resultats">
      <p class="historique-vendeur-page__colonne-titre">Résultats de la recherche</p>
      <HistoriqueTable :mouvements="resultatsRecherche" avec-recu @imprimer-recu="ouvrirApercuRecu" />
    </section>

    <RecuApercuModal
      v-if="venteEnApercu"
      :vente="venteEnApercu"
      :nom-entreprise="session.nomEntreprise.value"
      @imprimer="confirmerImpressionRecu"
      @fermer="venteEnApercu = null"
    />

    <RecuVenteModal
      v-if="recuJournalier"
      :items="recuJournalier.items"
      :total="recuJournalier.total"
      :date-heure="recuJournalier.dateHeure"
      @fermer="recuJournalier = null"
    />
  </GerantPageTemplate>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import HistoriqueHeader from '../components/organisms/HistoriqueHeader.vue';
import HistoriqueFilters from '../components/organisms/HistoriqueFilters.vue';
import HistoriqueTable from '../components/organisms/HistoriqueTable.vue';
import RecuApercuModal from '../components/organisms/RecuApercuModal.vue';
import RecuVenteModal from '../components/organisms/RecuVenteModal.vue';
import { get } from '../services/api';
import { useSession } from '../store/session';
import { formatCFA } from '../utils/format';

const session = useSession();

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

function versDateLocaleISO(dateIso) {
  const d = new Date(dateIso);
  const annee = d.getFullYear();
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const jour = String(d.getDate()).padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

function debutSemaine(reference) {
  const d = new Date(reference);
  const jour = d.getDay();
  const diff = (jour === 0 ? -6 : 1) - jour;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function estCeVendeur(personne) {
  return personne?.nomPrenoms === session.nomUtilisateur.value;
}

// Par défaut : AUJOURD'HUI (les tableaux "Entrée"/"Sorties"
// raisonnent par jour) — '' = toutes les dates, choisi via le
// bouton "Toutes les dates".
const dateChoisie = ref(versDateLocaleISO(new Date()));
const ordreTri = ref('desc');

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

// TOUTES les entrées de l'entreprise du jour choisi — pas filtrées
// par vendeur : une entrée de stock est toujours faite par le
// gérant, elle n'a jamais de vendeur associé, donc filtrer par
// estCeVendeur(m.vendeur) rendait cette colonne vide en permanence.
// Le vendeur peut légitimement vouloir voir ce qui est entré en
// stock (lecture seule).
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

// Casses signalées PAR CE VENDEUR ce jour-là.
const casses = computed(() =>
  mouvementsBruts.value
    .filter((m) => m.type === 'casse' && estCeVendeur(m.vendeur) && correspondALaDateChoisie(m.dateMouvement))
    .map((m) => ({
      produit: m.produit?.nom || '—',
      type: m.type,
      typeLabel: TYPE_LABELS.casse,
      quantite: m.quantite,
      date: formatDate(m.dateMouvement),
      heure: formatHeure(m.dateMouvement),
      utilisateur: m.vendeur?.nomPrenoms || '',
      dateIso: m.dateMouvement,
    }))
);

// Ventes DE CE VENDEUR ce jour-là. total et prixUnitaire ajoutés
// (nécessaires pour les reçus — avant, seul quantite était transmis).
const ventesMisesEnForme = computed(() =>
  ventesBrutes.value
    .filter((v) => estCeVendeur(v.vendeur) && correspondALaDateChoisie(v.dateVente))
    .map((v) => ({
      produit: v.produit?.nom || '—',
      type: 'sortie',
      typeLabel: TYPE_LABELS.sortie,
      quantite: v.quantite,
      total: v.total,
      prixUnitaire: v.prixUnitaire,
      date: formatDate(v.dateVente),
      heure: formatHeure(v.dateVente),
      utilisateur: v.vendeur?.nomPrenoms || '',
      dateIso: v.dateVente,
    }))
);

const ventesEtAutres = computed(() => trierParDate([...ventesMisesEnForme.value, ...casses.value]));

// Tout confondu POUR LE JOUR CHOISI (entrees et ventesEtAutres sont
// déjà filtrés par dateChoisie) — sert aux KPI et à la recherche.
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
const periodeChoisie = ref('toute');
const typeChoisi = ref('tous');

const optionsProduit = computed(() => {
  const produits = [...new Set(toutesActivites.value.map((m) => m.produit))];
  return [{ value: 'tous', label: 'Tous les produits' }, ...produits.map((p) => ({ value: p, label: p }))];
});

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

// -------------------------------------------------------------
// Reçu — aperçu avant impression, réutilisable même longtemps après
// la vente (un client peut redemander son reçu). ouvrirApercuRecu
// ouvre la modale d'aperçu ; confirmerImpressionRecu (déclenché
// depuis la modale) ouvre la fenêtre d'impression réelle. Ne dépend
// d'aucun état sauvegardé au moment de la vente, donc ça marche pour
// une vente d'il y a une semaine comme pour celle d'aujourd'hui.
// -------------------------------------------------------------
const venteEnApercu = ref(null);

function ouvrirApercuRecu(vente) {
  if (vente.type !== 'sortie') return;
  venteEnApercu.value = vente;
}

function confirmerImpressionRecu() {
  if (venteEnApercu.value) imprimerRecu(venteEnApercu.value);
  venteEnApercu.value = null;
}

function imprimerRecu(vente) {
  const prixUnitaire = vente.prixUnitaire ?? (vente.quantite ? Math.round((vente.total || 0) / vente.quantite) : 0);
  const fenetre = window.open('', '_blank', 'width=380,height=600');
  if (!fenetre) {
    window.alert("Merci d'autoriser les fenêtres pop-up pour imprimer le reçu.");
    return;
  }

  fenetre.document.write(`
    <html>
      <head>
        <title>Reçu — ${vente.produit}</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 16px; color: #1a1a1a; }
          h1 { font-size: 15px; text-align: center; margin: 0 0 4px; }
          .sous-titre { text-align: center; font-size: 11px; color: #555; margin: 0 0 14px; }
          .ligne { display: flex; justify-content: space-between; font-size: 12.5px; margin: 4px 0; }
          hr { border: none; border-top: 1px dashed #999; margin: 10px 0; }
          .total { font-weight: bold; font-size: 14px; }
          .pied { text-align: center; font-size: 10.5px; color: #777; margin-top: 16px; }
        </style>
      </head>
      <body>
        <h1>${session.nomEntreprise.value}</h1>
        <p class="sous-titre">Reçu de vente</p>
        <div class="ligne"><span>Date</span><span>${vente.date} à ${vente.heure}</span></div>
        <div class="ligne"><span>Vendeur</span><span>${vente.utilisateur}</span></div>
        <hr>
        <div class="ligne"><span>${vente.produit}</span><span>× ${vente.quantite}</span></div>
        <div class="ligne"><span>Prix unitaire</span><span>${formatCFA(prixUnitaire)}</span></div>
        <hr>
        <div class="ligne total"><span>Total</span><span>${formatCFA(vente.total || 0)}</span></div>
        <p class="pied">Reçu réimprimé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
      </body>
    </html>
  `);
  fenetre.document.close();
  fenetre.focus();
  fenetre.print();
}

// -------------------------------------------------------------
// Reçu journalier — regroupe toutes les ventes DE CE VENDEUR pour le
// jour choisi (dateChoisie) en un seul reçu, via le même
// RecuVenteModal que celui affiché juste après une vente sur le
// Catalogue vendeur (Voir le reçu). N'utilise que les données déjà
// chargées (ventesMisesEnForme, déjà filtrées par vendeur + jour) —
// pas de nouvel appel réseau. Le bouton n'apparaît que si un jour
// précis est sélectionné (pas "Toutes les dates") et qu'il y a au
// moins une vente ce jour-là.
// -------------------------------------------------------------
const recuJournalier = ref(null);

function imprimerRecuJournalier() {
  const ventesDuJour = ventesMisesEnForme.value;
  if (ventesDuJour.length === 0) return;

  const items = ventesDuJour.map((v) => ({
    nom: v.produit,
    quantite: v.quantite,
    prixUnitaire: v.prixUnitaire ?? (v.quantite ? Math.round((v.total || 0) / v.quantite) : 0),
  }));
  const total = ventesDuJour.reduce((s, v) => s + (v.total || 0), 0);
  const [annee, mois, jour] = dateChoisie.value.split('-');

  recuJournalier.value = { items, total, dateHeure: `Journée du ${jour}/${mois}/${annee}` };
}
</script>

<style scoped>
.historique-vendeur-page__erreur {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: #b3251d;
  font-style: italic;
}

.historique-vendeur-page__barre-date {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 var(--space-xl) var(--space-md);
}

.historique-vendeur-page__date-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--color-ink-muted);
}

.historique-vendeur-page__date-input {
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  padding: 0 8px;
  font-size: 12.5px;
  color: var(--color-ink);
}

.historique-vendeur-page__date-reset,
.historique-vendeur-page__tri-bouton {
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

.historique-vendeur-page__deux-colonnes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  padding: 0 var(--space-xl) var(--space-xl);
}

@media (max-width: 860px) {
  .historique-vendeur-page__deux-colonnes {
    grid-template-columns: 1fr;
  }
}

.historique-vendeur-page__colonne-titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-ink);
  margin: 0 0 var(--space-sm);
}

.historique-vendeur-page__resultats {
  padding: 0 var(--space-xl) var(--space-xl);
}

.historique-vendeur-page__recu-journalier {
  display: block;
  margin-top: var(--space-sm);
  width: 100%;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  color: var(--color-ink);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
</style>