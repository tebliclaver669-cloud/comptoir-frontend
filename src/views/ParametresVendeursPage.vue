<!--
  ParametresVendeursPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/parametres/vendeurs". Gestion des vendeurs
  de l'entreprise — entièrement basée sur le backend (store/vendeurs.js) :
    - liste chargée via listerVendeursParEntreprise (le statut
      "en ligne" et "mot de passe personnalisé" viennent déjà avec
      chaque vendeur) ;
    - ajout via creerVendeur ;
    - modification / réinitialisation du mot de passe via
      mettreAJourVendeur (le mot de passe du GÉRANT est vérifié côté
      serveur, jamais côté client) ;
    - suppression via supprimerVendeur, confirmée par ConfirmModal
      (fenêtre stylée) au lieu de window.confirm() (boîte native du
      navigateur, non personnalisable) ;
    - historique de connexions via listerHistoriqueConnexions.

  Toutes les opérations sont identifiées par l'id du vendeur.
-->
<template>
  <GerantPageTemplate>
    <header class="parametres-vendeurs-page__header">
      <div>
        <h1 class="parametres-vendeurs-page__titre">Gestion des vendeurs</h1>
        <p class="parametres-vendeurs-page__sous-titre">{{ session.nomEntreprise.value }}</p>
      </div>

      <div class="parametres-vendeurs-page__header-actions">
        <input
          v-model="recherche"
          type="search"
          class="parametres-vendeurs-page__recherche"
          placeholder="Rechercher un vendeur…"
        />
        <button type="button" class="parametres-vendeurs-page__ajouter" @click="afficherFormulaireAjout = true">
          + Ajouter un vendeur
        </button>
      </div>
    </header>

    <p v-if="erreurChargement" class="parametres-vendeurs-page__erreur">{{ erreurChargement }}</p>
    <p v-else-if="chargement" class="parametres-vendeurs-page__vide">Chargement…</p>
    <p v-else-if="vendeursAffiches.length === 0" class="parametres-vendeurs-page__vide">
      Aucun vendeur enregistré pour le moment.
    </p>

    <div v-else class="parametres-vendeurs-page__table-wrapper">
      <table class="parametres-vendeurs-page__table">
        <thead>
          <tr>
            <th>Statut</th>
            <th>Nom et prénoms</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in vendeursAffiches" :key="v.id">
            <td>
              <span
                class="parametres-vendeurs-page__statut"
                :class="v.enLigne ? 'parametres-vendeurs-page__statut--en-ligne' : 'parametres-vendeurs-page__statut--hors-ligne'"
              >
                {{ v.enLigne ? 'En ligne' : 'Hors ligne' }}
              </span>
            </td>
            <td>{{ v.nomPrenoms }}</td>
            <td>{{ v.email || '—' }}</td>
            <td>{{ v.telephone || '—' }}</td>
            <td class="parametres-vendeurs-page__actions">
              <button type="button" @click="ouvrirHistorique(v)">Historique</button>
              <button type="button" @click="ouvrirEdition(v)">Modifier</button>
              <button type="button" class="parametres-vendeurs-page__supprimer" @click="demanderSuppression(v)">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AjouterVendeurForm
      v-if="afficherFormulaireAjout"
      ref="formulaireAjoutRef"
      @ajouter="gererAjoutVendeur"
      @fermer="afficherFormulaireAjout = false"
    />

    <ModifierVendeurModal
      v-if="vendeurEnEdition"
      ref="modaleEditionRef"
      :nom-vendeur="nomVendeurEnEdition"
      :email="vendeurEnEdition.email"
      :telephone="vendeurEnEdition.telephone"
      :mot-de-passe-personnalise="vendeurEnEdition.motDePassePersonnalise"
      @enregistrer="gererEnregistrementVendeur"
      @fermer="vendeurEnEdition = null"
    />

    <HistoriqueVendeurModal
      v-if="vendeurHistoriqueOuvert"
      :nom-vendeur="vendeurHistoriqueOuvert.nomPrenoms"
      :connexions="historiqueDuVendeurOuvert"
      :chargement="chargementHistorique"
      @fermer="vendeurHistoriqueOuvert = null"
    />

    <ConfirmModal
      v-if="vendeurASupprimer"
      titre="Supprimer"
      :message="`Supprimer « ${vendeurASupprimer.nomPrenoms} » définitivement ?`"
      texte-confirmer="Supprimer"
      danger
      @confirmer="confirmerSuppression"
      @annuler="vendeurASupprimer = null"
    />
  </GerantPageTemplate>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import AjouterVendeurForm from '../components/organisms/AjouterVendeurForm.vue';
import ModifierVendeurModal from '../components/organisms/ModifierVendeurModal.vue';
import HistoriqueVendeurModal from '../components/organisms/HistoriqueVendeurModal.vue';
import ConfirmModal from '../components/organisms/ConfirmModal.vue';
import {
  listerVendeursParEntreprise,
  creerVendeur,
  mettreAJourVendeur,
  supprimerVendeur,
  listerHistoriqueConnexions,
} from '../store/vendeurs';
import { useSession } from '../store/session';

const session = useSession();

const vendeurs = ref([]);
const chargement = ref(true);
const erreurChargement = ref('');

async function chargerVendeurs() {
  chargement.value = true;
  erreurChargement.value = '';
  try {
    vendeurs.value = await listerVendeursParEntreprise(session.nomEntreprise.value);
  } catch (erreur) {
    erreurChargement.value = erreur.message;
  } finally {
    chargement.value = false;
  }
}

onMounted(chargerVendeurs);

const recherche = ref('');

const vendeursAffiches = computed(() =>
  vendeurs.value.filter((v) => v.nomPrenoms.toLowerCase().includes(recherche.value.toLowerCase().trim()))
);

// -------------------------------------------------------------
// Ajout
// -------------------------------------------------------------
const afficherFormulaireAjout = ref(false);
const formulaireAjoutRef = ref(null);

async function gererAjoutVendeur(donnees) {
  try {
    await creerVendeur(session.nomEntreprise.value, donnees);
    afficherFormulaireAjout.value = false;
    await chargerVendeurs();
  } catch (erreur) {
    if (formulaireAjoutRef.value) formulaireAjoutRef.value.erreur = erreur.message;
    else window.alert(erreur.message);
  }
}

// -------------------------------------------------------------
// Édition (infos + réinitialisation du mot de passe)
// -------------------------------------------------------------
const vendeurEnEdition = ref(null);
const modaleEditionRef = ref(null);

const nomVendeurEnEdition = computed(() => vendeurEnEdition.value?.nomPrenoms || '');

function ouvrirEdition(vendeur) {
  vendeurEnEdition.value = vendeur;
}

async function gererEnregistrementVendeur(donnees) {
  try {
    await mettreAJourVendeur(vendeurEnEdition.value.id, donnees);
    vendeurEnEdition.value = null;
    await chargerVendeurs();
  } catch (erreur) {
    if (modaleEditionRef.value) modaleEditionRef.value.erreur = erreur.message;
    else window.alert(erreur.message);
  }
}

// -------------------------------------------------------------
// Suppression — passe par ConfirmModal au lieu de window.confirm().
// -------------------------------------------------------------
const vendeurASupprimer = ref(null);

function demanderSuppression(vendeur) {
  vendeurASupprimer.value = vendeur;
}

async function confirmerSuppression() {
  const vendeur = vendeurASupprimer.value;
  vendeurASupprimer.value = null;

  try {
    await supprimerVendeur(vendeur.id);
    await chargerVendeurs();
  } catch (erreur) {
    window.alert(erreur.message);
  }
}

// -------------------------------------------------------------
// Historique de connexions
// -------------------------------------------------------------
const vendeurHistoriqueOuvert = ref(null);
const historiqueDuVendeurOuvert = ref([]);
const chargementHistorique = ref(false);

async function ouvrirHistorique(vendeur) {
  vendeurHistoriqueOuvert.value = { id: vendeur.id, nomPrenoms: vendeur.nomPrenoms };
  historiqueDuVendeurOuvert.value = [];
  chargementHistorique.value = true;
  try {
    historiqueDuVendeurOuvert.value = await listerHistoriqueConnexions(session.nomEntreprise.value, vendeur.id);
  } catch (erreur) {
    window.alert(erreur.message);
  } finally {
    chargementHistorique.value = false;
  }
}
</script>

<style scoped>
.parametres-vendeurs-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-xl) 0;
}

.parametres-vendeurs-page__titre {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-ink);
}

.parametres-vendeurs-page__sous-titre {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: var(--color-ink-muted);
}

.parametres-vendeurs-page__header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.parametres-vendeurs-page__recherche {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: 13px;
  background: var(--color-bg-panel-muted);
  color: var(--color-ink);
}

.parametres-vendeurs-page__ajouter {
  background: var(--color-green);
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #DDE6DA;
  cursor: pointer;
  white-space: nowrap;
}

.parametres-vendeurs-page__vide,
.parametres-vendeurs-page__erreur {
  margin: var(--space-lg) var(--space-xl);
  font-size: 12.5px;
  color: var(--color-ink-muted);
  font-style: italic;
}

.parametres-vendeurs-page__erreur {
  color: var(--color-red, #c0392b);
  font-style: normal;
}

.parametres-vendeurs-page__table-wrapper {
  margin: var(--space-lg) var(--space-xl) var(--space-xl);
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
}

.parametres-vendeurs-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.parametres-vendeurs-page__table th {
  text-align: left;
  padding: 10px 14px;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.parametres-vendeurs-page__table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-bg-panel-muted);
  color: var(--color-ink);
  overflow-wrap: break-word;
}

.parametres-vendeurs-page__table tr:last-child td {
  border-bottom: none;
}

.parametres-vendeurs-page__statut {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 2px;
  white-space: nowrap;
  color: #DDE6DA;
}

.parametres-vendeurs-page__statut--en-ligne {
  background: var(--color-green);
}

.parametres-vendeurs-page__statut--hors-ligne {
  background: var(--color-ink-muted);
}

.parametres-vendeurs-page__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.parametres-vendeurs-page__actions button {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  font-size: 12px;
  color: var(--color-ink);
  cursor: pointer;
  white-space: nowrap;
}

.parametres-vendeurs-page__supprimer {
  color: var(--color-red, #c0392b);
  border-color: var(--color-red, #c0392b);
}
</style>