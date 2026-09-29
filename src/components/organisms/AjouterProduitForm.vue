<!--
  AjouterProduitForm.vue (organism)
  --------------------------------------------------------------
  Rôle : fenêtre pour soit RÉAPPROVISIONNER un produit déjà
  enregistré (choisi dans la liste déroulante "PRODUIT"), soit créer
  un NOUVEAU produit — nom, catégorie, prix d'achat/vente, quantité
  reçue, fournisseur, et numéro de reçu optionnel. Pas de seuil
  d'alerte ici (réglé plus tard depuis Catalogue).

  Par défaut on part de la liste des produits existants (cas le plus
  courant en approvisionnement) ; le petit bouton "+" à côté bascule
  vers un formulaire vierge pour un produit totalement nouveau — sur
  un nouveau produit, le champ "catégorie" propose automatiquement
  une suggestion selon le nom saisi (ex. "coca" -> "Boisson"), via un
  petit bouton qui déroule la liste des suggestions/catégories déjà
  utilisées ; l'utilisateur reste libre de taper une catégorie inédite.

  Emits :
    - ajouter(donnees) — donnees.estNouveauProduit distingue les 2 cas
    - fermer
-->
<template>
  <div class="ajouter-produit-modal__overlay" @click.self="$emit('fermer')">
    <div class="ajouter-produit-modal">
      <p class="ajouter-produit-modal__titre">
        {{ modeNouveauProduit ? 'Ajouter un produit' : 'Réapprovisionner un produit' }}
      </p>

      <div class="ajouter-produit-modal__row">
        <label class="ajouter-produit-modal__label" for="produitExistant">PRODUIT</label>
        <div class="ajouter-produit-modal__produit-existant-row">
          <select
            id="produitExistant"
            class="ajouter-produit-modal__input"
            :disabled="modeNouveauProduit"
            :value="nomProduitSelectionne"
            @change="selectionnerProduitExistant($event.target.value)"
          >
            <option value="" disabled>
              {{ produitsExistants.length ? 'Choisir le produit' : 'Aucun produit enregistré' }}
            </option>
            <option v-for="p in produitsExistants" :key="p.nom" :value="p.nom">{{ p.nom }}</option>
          </select>
          <button
            type="button"
            class="ajouter-produit-modal__nouveau-btn"
            :class="{ 'ajouter-produit-modal__nouveau-btn--actif': modeNouveauProduit }"
            :title="modeNouveauProduit ? 'Choisir un produit existant' : 'Nouveau produit'"
            :aria-label="modeNouveauProduit ? 'Choisir un produit existant' : 'Nouveau produit'"
            @click="basculerNouveauProduit"
          >
            +
          </button>
        </div>
        <p class="ajouter-produit-modal__aide">
          {{ modeNouveauProduit
            ? 'Nouveau produit — remplissez tous les champs ci-dessous.'
            : 'Choisissez un produit pour le réapprovisionner, ou cliquez sur "+" pour en ajouter un nouveau.' }}
        </p>
      </div>

      <div class="ajouter-produit-modal__row">
        <label class="ajouter-produit-modal__label" for="nom">NOM DU PRODUIT</label>
        <input
          id="nom"
          type="text"
          class="ajouter-produit-modal__input"
          v-model="formulaire.nom"
          :disabled="!modeNouveauProduit"
        >
      </div>

      <div class="ajouter-produit-modal__row">
        <label class="ajouter-produit-modal__label" for="categorie">CATÉGORIE</label>
        <div class="ajouter-produit-modal__categorie-row">
          <input
            id="categorie"
            type="text"
            class="ajouter-produit-modal__input"
            placeholder="ex. Boisson"
            v-model="formulaire.categorie"
            :disabled="!modeNouveauProduit"
          >
          <div v-if="modeNouveauProduit" class="ajouter-produit-modal__categorie-dropdown-wrap">
            <button
              type="button"
              class="ajouter-produit-modal__categorie-toggle"
              aria-label="Voir les suggestions de catégorie"
              @click="categorieMenuOuvert = !categorieMenuOuvert"
            >
              ▾
            </button>
            <div v-if="categorieMenuOuvert" class="ajouter-produit-modal__categorie-popover">
              <button
                v-if="categorieSuggeree"
                type="button"
                class="ajouter-produit-modal__categorie-option ajouter-produit-modal__categorie-option--suggestion"
                @click="choisirCategorie(categorieSuggeree)"
              >
                {{ categorieSuggeree }}
                <span class="ajouter-produit-modal__categorie-tag">suggestion</span>
              </button>
              <button
                v-for="cat in categoriesAutres"
                :key="cat"
                type="button"
                class="ajouter-produit-modal__categorie-option"
                @click="choisirCategorie(cat)"
              >
                {{ cat }}
              </button>
              <p v-if="!categorieSuggeree && !categoriesAutres.length" class="ajouter-produit-modal__categorie-vide">
                Aucune suggestion — tapez directement une nouvelle catégorie.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="ajouter-produit-modal__grid">
        <div class="ajouter-produit-modal__row">
          <label class="ajouter-produit-modal__label" for="prixAchat">PRIX D'ACHAT</label>
          <input id="prixAchat" type="number" min="0" class="ajouter-produit-modal__input" v-model.number="formulaire.prixAchat">
        </div>
        <div class="ajouter-produit-modal__row">
          <label class="ajouter-produit-modal__label" for="prixVente">PRIX DE VENTE</label>
          <input id="prixVente" type="number" min="0" class="ajouter-produit-modal__input" v-model.number="formulaire.prixVente">
        </div>
      </div>

      <div class="ajouter-produit-modal__row">
        <label class="ajouter-produit-modal__label" for="stockInitial">
          {{ modeNouveauProduit ? 'STOCK INITIAL' : 'QUANTITÉ REÇUE' }}
        </label>
        <input id="stockInitial" type="number" min="0" class="ajouter-produit-modal__input" v-model.number="formulaire.stockInitial">
      </div>

      <div class="ajouter-produit-modal__row" v-if="modeNouveauProduit">
        <div class="ajouter-produit-modal__grid">
          <div class="ajouter-produit-modal__row">
            <label class="ajouter-produit-modal__label" for="fournisseurNom">FOURNISSEUR</label>
            <input id="fournisseurNom" type="text" class="ajouter-produit-modal__input" v-model="formulaire.fournisseurNom">
          </div>
          <div class="ajouter-produit-modal__row">
            <label class="ajouter-produit-modal__label" for="fournisseurTel">TÉLÉPHONE</label>
            <input id="fournisseurTel" type="text" class="ajouter-produit-modal__input" v-model="formulaire.fournisseurTel">
          </div>
        </div>
      </div>

      <!-- Produit existant : nom et téléphone du fournisseur ont chacun
           leur propre petit bouton juste au-dessus du champ — "+" pour
           saisir un nouveau nom, "changer" pour corriger le numéro —
           plutôt qu'un seul lien partagé pour les deux à la fois. -->
      <div class="ajouter-produit-modal__grid" v-else>
        <div class="ajouter-produit-modal__row">
          <div class="ajouter-produit-modal__label-row">
            <label class="ajouter-produit-modal__label" for="fournisseurNom">FOURNISSEUR</label>
            <button
              v-if="!editionFournisseurNom"
              type="button"
              class="ajouter-produit-modal__champ-btn"
              title="Ajouter un nouveau fournisseur"
              aria-label="Ajouter un nouveau fournisseur"
              @click="activerEditionFournisseurNom"
            >+</button>
            <button
              v-else
              type="button"
              class="ajouter-produit-modal__champ-btn"
              @click="annulerEditionFournisseurNom"
            >Annuler</button>
          </div>
          <p v-if="!editionFournisseurNom" class="ajouter-produit-modal__champ-lecture">
            {{ formulaire.fournisseurNom || 'Aucun' }}
          </p>
          <input
            v-else
            id="fournisseurNom"
            type="text"
            class="ajouter-produit-modal__input"
            placeholder="Nom du nouveau fournisseur"
            v-model="formulaire.fournisseurNom"
          >
        </div>

        <div class="ajouter-produit-modal__row">
          <div class="ajouter-produit-modal__label-row">
            <label class="ajouter-produit-modal__label" for="fournisseurTel">TÉLÉPHONE</label>
            <button
              v-if="!editionFournisseurTel"
              type="button"
              class="ajouter-produit-modal__champ-btn"
              title="Changer le numéro"
              aria-label="Changer le numéro"
              @click="activerEditionFournisseurTel"
            >changer</button>
            <button
              v-else
              type="button"
              class="ajouter-produit-modal__champ-btn"
              @click="annulerEditionFournisseurTel"
            >Annuler</button>
          </div>
          <p v-if="!editionFournisseurTel" class="ajouter-produit-modal__champ-lecture">
            {{ formulaire.fournisseurTel || '—' }}
          </p>
          <input
            v-else
            id="fournisseurTel"
            type="text"
            class="ajouter-produit-modal__input"
            v-model="formulaire.fournisseurTel"
          >
        </div>
      </div>

      <div class="ajouter-produit-modal__row">
        <label class="ajouter-produit-modal__label" for="numeroRecu">N° DE REÇU (facultatif)</label>
        <input id="numeroRecu" type="text" class="ajouter-produit-modal__input" v-model="formulaire.numeroRecu">
      </div>

      <p v-if="messageErreur" class="ajouter-produit-modal__erreur">{{ messageErreur }}</p>

      <div class="ajouter-produit-modal__actions">
        <button type="button" class="ajouter-produit-modal__annuler" @click="$emit('fermer')">Annuler</button>
        <button type="button" class="ajouter-produit-modal__enregistrer" @click="valider">
          {{ modeNouveauProduit ? 'Ajouter' : 'Réapprovisionner' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { listerProduits } from '../../store/produits';

const emit = defineEmits(['ajouter', 'fermer']);

const produitsExistants = listerProduits();

// Faux dictionnaire mot-clé -> catégorie, pour proposer automatiquement
// une catégorie à partir du nom saisi (ex. "coca" -> "Boisson").
// Reste une SUGGESTION : le champ catégorie est un texte libre, donc
// n'importe quelle nouvelle catégorie peut toujours être tapée.
const DICTIONNAIRE_CATEGORIES = [
  { motsCles: ['coca', 'cola', 'fanta', 'sprite', 'soda', 'jus', 'eau minerale', 'eau minérale', 'biere', 'bière', 'boisson', 'limonade'], categorie: 'Boisson' },
  { motsCles: ['tee-shirt', 'tshirt', 't-shirt', 'chemise', 'pantalon', 'robe', 'jupe', 'veste', 'pull', 'jean', 'short', 'vetement', 'vêtement', 'chaussure', 'basket', 'sandale'], categorie: 'Vêtement' },
  { motsCles: ['riz', 'spaghetti', 'pate', 'pâte', 'huile', 'sucre', 'farine', 'lait', 'oeuf', 'œuf', 'pain', 'cerelac', 'cérélac', 'sel', 'tomate', 'conserve', 'aliment', 'biscuit'], categorie: 'Alimentation' },
  { motsCles: ['savon', 'dentifrice', 'shampoing', 'shampooing', 'gel douche', 'papier hygienique', 'papier hygiénique', 'couche', 'serviette hygienique'], categorie: 'Hygiène' },
  { motsCles: ['cahier', 'stylo', 'crayon', 'gomme', 'regle', 'règle', 'classeur', 'papeterie'], categorie: 'Papeterie' },
  { motsCles: ['telephone', 'téléphone', 'chargeur', 'batterie', 'ecouteur', 'écouteur', 'cable', 'câble'], categorie: 'Électronique' },
];

function suggererCategorieDepuisNom(nom) {
  const nomNormalise = (nom || '').toLowerCase().trim();
  if (!nomNormalise) return '';
  const trouve = DICTIONNAIRE_CATEGORIES.find((entree) =>
    entree.motsCles.some((mot) => nomNormalise.includes(mot))
  );
  return trouve ? trouve.categorie : '';
}

const formulaireVierge = () => ({
  nom: '',
  categorie: '',
  prixAchat: null,
  prixVente: null,
  stockInitial: 0,
  fournisseurNom: '',
  fournisseurTel: '',
  numeroRecu: '',
});

const formulaire = reactive(formulaireVierge());
const messageErreur = ref('');

// false = on réapprovisionne un produit choisi dans la liste (cas le
// plus courant) ; true = formulaire vierge pour un produit inédit.
const modeNouveauProduit = ref(false);
const nomProduitSelectionne = ref('');
const categorieMenuOuvert = ref(false);
// Pour un produit existant : nom et téléphone du fournisseur
// s'affichent en lecture seule, chacun avec son propre bouton pour
// passer en édition (indépendants l'un de l'autre).
const editionFournisseurNom = ref(false);
const editionFournisseurTel = ref(false);

const categorieSuggeree = computed(() => suggererCategorieDepuisNom(formulaire.nom));

const categoriesAutres = computed(() => {
  const ensemble = new Set(produitsExistants.map((p) => p.categorie).filter(Boolean));
  return [...ensemble].filter((cat) => cat !== categorieSuggeree.value).sort((a, b) => a.localeCompare(b));
});

// Tant que l'utilisateur n'a pas encore lui-même rempli de catégorie,
// on la pré-remplit automatiquement dès qu'une suggestion apparaît.
watch(
  () => formulaire.nom,
  () => {
    if (modeNouveauProduit.value && !formulaire.categorie.trim() && categorieSuggeree.value) {
      formulaire.categorie = categorieSuggeree.value;
    }
  }
);

function choisirCategorie(categorie) {
  formulaire.categorie = categorie;
  categorieMenuOuvert.value = false;
}

function selectionnerProduitExistant(nom) {
  const produit = produitsExistants.find((p) => p.nom === nom);
  if (!produit) return;

  nomProduitSelectionne.value = nom;
  editionFournisseurNom.value = false;
  editionFournisseurTel.value = false;
  messageErreur.value = '';
  Object.assign(formulaire, {
    nom: produit.nom,
    categorie: produit.categorie,
    prixAchat: produit.prixAchat,
    prixVente: produit.prixVente,
    stockInitial: 0,
    fournisseurNom: produit.fournisseurNom || '',
    fournisseurTel: produit.fournisseurTel || '',
    numeroRecu: '',
  });
}

function basculerNouveauProduit() {
  modeNouveauProduit.value = !modeNouveauProduit.value;
  nomProduitSelectionne.value = '';
  categorieMenuOuvert.value = false;
  editionFournisseurNom.value = false;
  editionFournisseurTel.value = false;
  messageErreur.value = '';
  Object.assign(formulaire, formulaireVierge());
}

// "+" sur FOURNISSEUR : repart d'un champ vide pour saisir un nom
// totalement nouveau (le fournisseur habituel ne suffit plus).
function activerEditionFournisseurNom() {
  editionFournisseurNom.value = true;
  formulaire.fournisseurNom = '';
}

function annulerEditionFournisseurNom() {
  editionFournisseurNom.value = false;
  const produit = produitsExistants.find((p) => p.nom === nomProduitSelectionne.value);
  formulaire.fournisseurNom = produit?.fournisseurNom || '';
}

// "changer" sur TÉLÉPHONE : garde la valeur actuelle dans le champ,
// prête à être corrigée (plutôt qu'un champ vide comme pour le nom).
function activerEditionFournisseurTel() {
  editionFournisseurTel.value = true;
}

function annulerEditionFournisseurTel() {
  editionFournisseurTel.value = false;
  const produit = produitsExistants.find((p) => p.nom === nomProduitSelectionne.value);
  formulaire.fournisseurTel = produit?.fournisseurTel || '';
}

function valider() {
  if (!modeNouveauProduit.value && !nomProduitSelectionne.value) {
    messageErreur.value = 'Choisissez un produit existant, ou cliquez sur "+" pour en ajouter un nouveau.';
    return;
  }

  if (
    modeNouveauProduit.value &&
    (!formulaire.nom.trim() || !formulaire.categorie.trim() || formulaire.prixAchat == null || formulaire.prixVente == null)
  ) {
    messageErreur.value = 'Merci de remplir au moins le nom, la catégorie et les deux prix.';
    return;
  }

  emit('ajouter', { ...formulaire, estNouveauProduit: modeNouveauProduit.value });
}
</script>

<style scoped>
.ajouter-produit-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.ajouter-produit-modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  width: 380px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.ajouter-produit-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 17px;
  color: var(--color-ink);
  margin: 0 0 var(--space-lg);
}

.ajouter-produit-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.ajouter-produit-modal__row {
  margin-bottom: 14px;
}

.ajouter-produit-modal__label {
  display: block;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  margin-bottom: 6px;
}

.ajouter-produit-modal__input {
  width: 100%;
  box-sizing: border-box;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  padding: 0 10px;
  font-size: 13.5px;
  color: var(--color-ink);
}

.ajouter-produit-modal__input:disabled {
  background: var(--color-bg-panel-muted);
  color: var(--color-ink-muted);
  cursor: not-allowed;
}

.ajouter-produit-modal__aide {
  margin: 6px 0 0;
  font-size: 11px;
  font-style: italic;
  color: var(--color-ink-muted);
}

.ajouter-produit-modal__produit-existant-row {
  display: flex;
  gap: 8px;
}

.ajouter-produit-modal__produit-existant-row .ajouter-produit-modal__input {
  flex: 1;
}

.ajouter-produit-modal__nouveau-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: 1px dashed var(--color-tan);
  border-radius: 4px;
  background: transparent;
  color: var(--color-tan);
  font-size: 18px;
  line-height: 1;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.ajouter-produit-modal__nouveau-btn:hover {
  background: rgba(169, 130, 92, 0.12);
}

.ajouter-produit-modal__nouveau-btn--actif {
  background: var(--color-tan);
  color: var(--color-cream-light);
  border-style: solid;
  transform: rotate(45deg);
}

.ajouter-produit-modal__categorie-row {
  display: flex;
  gap: 8px;
}

.ajouter-produit-modal__categorie-row .ajouter-produit-modal__input {
  flex: 1;
}

.ajouter-produit-modal__categorie-dropdown-wrap {
  position: relative;
  flex-shrink: 0;
}

.ajouter-produit-modal__categorie-toggle {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  color: var(--color-ink-muted);
  font-size: 12px;
  cursor: pointer;
}

.ajouter-produit-modal__categorie-toggle:hover {
  border-color: var(--color-tan);
  color: var(--color-tan);
}

.ajouter-produit-modal__categorie-popover {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 200px;
  max-height: 220px;
  overflow-y: auto;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 8px);
  padding: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 5;
}

.ajouter-produit-modal__categorie-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  padding: 7px 9px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-ink);
  font-size: 12.5px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.ajouter-produit-modal__categorie-option:hover {
  background: var(--color-green-soft);
}

.ajouter-produit-modal__categorie-option--suggestion {
  background: rgba(169, 130, 92, 0.12);
}

.ajouter-produit-modal__categorie-tag {
  font-size: 9.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-tan);
}

.ajouter-produit-modal__categorie-vide {
  margin: 4px;
  font-size: 11.5px;
  font-style: italic;
  color: var(--color-ink-muted);
}

.ajouter-produit-modal__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.ajouter-produit-modal__label-row .ajouter-produit-modal__label {
  margin-bottom: 0;
}

.ajouter-produit-modal__champ-btn {
  flex-shrink: 0;
  border: 1px dashed var(--color-tan);
  border-radius: 999px;
  background: transparent;
  color: var(--color-tan);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.02em;
  line-height: 1;
  padding: 3px 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.ajouter-produit-modal__champ-btn:hover {
  background: rgba(169, 130, 92, 0.12);
}

.ajouter-produit-modal__champ-lecture {
  margin: 0;
  box-sizing: border-box;
  height: 36px;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg-panel-muted);
  padding: 0 10px;
  font-size: 13.5px;
  color: var(--color-ink);
}

.ajouter-produit-modal__erreur {
  color: #b3251d;
  font-style: italic;
  font-size: 12.5px;
  margin: 0 0 var(--space-md);
}

.ajouter-produit-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.ajouter-produit-modal__annuler {
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-ink-muted);
  font-weight: 500;
  font-size: 13.5px;
  cursor: pointer;
}

.ajouter-produit-modal__enregistrer {
  height: 38px;
  padding: 0 18px;
  border: none;
  border-radius: 4px;
  background: var(--color-green);
  color: var(--color-text-on-dark);
  font-weight: 500;
  font-size: 13.5px;
  cursor: pointer;
}
</style>