<!--
  ApprovisionnementPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/approvisionnement". Store partagé
  produits.js (backend) : ajout de produit, validation de réception,
  et modification/suppression du fournisseur d'un produit.

  Réception de stock (gererValidationAppro) : appelle le vrai backend
  (POST /api/mouvements, type 'entree').

  Dépenses : branché sur la route dédiée
  GET /api/mouvements/:nomEntreprise/depenses (total + détail déjà
  calculés côté serveur). Total ET détail sont maintenant entièrement
  affichés dans ApprovisionnementHeader (badge cliquable à côté de la
  recherche, qui déroule la liste) — il n'y a plus de panneau séparé
  en bas de page. Cette même liste sert aussi à calculer "Dernier
  ajout" (colonne de SupplyTable) : chaque dépense EST une entrée en
  stock (achat initial ou réapprovisionnement), donc pour chaque
  produit on prend la dépense la plus récente par nom de produit —
  pas besoin d'un appel backend supplémentaire.

  Suppression : passe par ConfirmModal (fenêtre stylée) au lieu de
  window.confirm() (boîte native du navigateur, non personnalisable).
-->
<template>
  <GerantPageTemplate>
    <ApprovisionnementHeader
      role="Gérant"
      :nom="session.nomUtilisateur.value"
      v-model:recherche="recherche"
      :nombre-selection="selection.length"
      :total-depenses="totalDepenses"
      :depenses="depenses"
      :chargement-depenses="chargementDepenses"
      @ajouter-click="afficherFormulaireAjout = true"
      @supprimer-click="demanderSuppression"
    />

    <div class="approvisionnement-page__table-wrapper">
      <SupplyTable
        v-model:selection="selection"
        :products="produitsAffiches"
        @valider="gererValidationAppro"
        @modifier-fournisseur="ouvrirModificationFournisseur"
      />
    </div>

    <AjouterProduitForm
      v-if="afficherFormulaireAjout"
      @ajouter="gererAjoutProduit"
      @fermer="afficherFormulaireAjout = false"
    />

    <ModifierFournisseurModal
      v-if="produitFournisseurEnEdition"
      :produit="produitFournisseurEnEdition"
      @enregistrer="gererEnregistrementFournisseur"
      @supprimer="gererSuppressionFournisseur"
      @fermer="produitFournisseurEnEdition = null"
    />

    <ConfirmModal
      v-if="confirmationSuppressionOuverte"
      titre="Supprimer"
      :message="messageConfirmationSuppression"
      texte-confirmer="Supprimer"
      danger
      @confirmer="confirmerSuppression"
      @annuler="confirmationSuppressionOuverte = false"
    />
  </GerantPageTemplate>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import ApprovisionnementHeader from '../components/organisms/ApprovisionnementHeader.vue';
import SupplyTable from '../components/organisms/SupplyTable.vue';
import AjouterProduitForm from '../components/organisms/AjouterProduitForm.vue';
import ModifierFournisseurModal from '../components/organisms/ModifierFournisseurModal.vue';
import ConfirmModal from '../components/organisms/ConfirmModal.vue';
import { listerProduits, creerProduit, supprimerProduits, chargerProduits, mettreAJourFournisseur } from '../store/produits';
import { get, post } from '../services/api';
import { useSession } from '../store/session';

const session = useSession();
const produits = listerProduits();

const STATUTS = {
  correct: 'Stock correct',
  'bas-du-seuil': 'Bas du seuil',
  rupture: 'Rupture',
};

function calculerStatut(produit) {
  if (produit.stock === 0) return 'rupture';
  if (produit.stock <= produit.seuilAlerte) return 'bas-du-seuil';
  return 'correct';
}

function formatDate(dateIso) {
  return new Date(dateIso).toLocaleDateString('fr-FR');
}

function formatHeure(dateIso) {
  return new Date(dateIso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// -------------------------------------------------------------
// Dépenses — route dédiée backend. Total + détail sont passés à
// ApprovisionnementHeader (badge cliquable). Sert aussi de source
// pour "Dernier ajout" (voir dernieresEntreesParProduit ci-dessous) :
// chaque dépense correspond à une entrée en stock (achat initial ou
// réapprovisionnement), il suffit de garder la plus récente par nom
// de produit.
// -------------------------------------------------------------
const depenses = ref([]);
const totalDepenses = ref(0);
const chargementDepenses = ref(true);

async function chargerDepenses() {
  chargementDepenses.value = true;
  try {
    const reponse = await get(`/mouvements/${encodeURIComponent(session.nomEntreprise.value)}/depenses`);
    depenses.value = reponse.depenses;
    totalDepenses.value = reponse.total;
  } catch {
    depenses.value = [];
    totalDepenses.value = 0;
  } finally {
    chargementDepenses.value = false;
  }
}

onMounted(chargerDepenses);

// Pour chaque produit (par nom), la dépense la plus récente —
// c'est la "dernière entrée en stock" de ce produit.
const dernieresEntreesParProduit = computed(() => {
  const map = {};
  for (const d of depenses.value) {
    const existante = map[d.produit];
    if (!existante || new Date(d.dateMouvement) > new Date(existante.dateMouvement)) {
      map[d.produit] = d;
    }
  }
  return map;
});

const produitsAvecStatut = computed(() =>
  produits.map((p) => {
    const statut = calculerStatut(p);
    const derniereEntreeBrute = dernieresEntreesParProduit.value[p.nom];
    const derniereEntree = derniereEntreeBrute
      ? {
          quantite: derniereEntreeBrute.quantite,
          date: formatDate(derniereEntreeBrute.dateMouvement),
          heure: formatHeure(derniereEntreeBrute.dateMouvement),
        }
      : null;
    return { ...p, statut, statutLabel: STATUTS[statut], derniereEntree };
  })
);

const recherche = ref('');

const produitsAffiches = computed(() =>
  produitsAvecStatut.value.filter((p) => p.nom.toLowerCase().includes(recherche.value.toLowerCase().trim()))
);

// -------------------------------------------------------------
// Réception de stock — vrai backend.
// -------------------------------------------------------------
async function gererValidationAppro(produit, quantite) {
  if (!quantite || quantite <= 0) return;

  try {
    await post('/mouvements', {
      nomEntreprise: session.nomEntreprise.value,
      produitId: produit.id,
      type: 'entree',
      quantite,
    });

    // Le stock a changé côté backend -> on recharge la liste
    // partagée (utilisée aussi par Catalogue et les tableaux de
    // bord) et les dépenses (qui alimentent aussi "Dernier ajout").
    await Promise.all([
      chargerProduits(session.nomEntreprise.value),
      chargerDepenses(),
    ]);
  } catch (erreur) {
    window.alert(erreur.message);
  }
}

const afficherFormulaireAjout = ref(false);

async function gererAjoutProduit(donnees) {
  try {
    // Le backend crée déjà le mouvement d'entrée initial (et
    // fusionne avec un produit existant de même nom+catégorie) —
    // pas besoin de l'enregistrer une deuxième fois ici.
    await creerProduit(session.nomEntreprise.value, {
      nom: donnees.nom,
      categorie: donnees.categorie,
      prixAchat: donnees.prixAchat,
      prixVente: donnees.prixVente,
      stock: donnees.stockInitial || 0,
      fournisseurNom: donnees.fournisseurNom,
      fournisseurTel: donnees.fournisseurTel,
    });

    await chargerDepenses();
  } catch (erreur) {
    window.alert(erreur.message);
    return;
  }

  afficherFormulaireAjout.value = false;
}

const selection = ref([]);

// -------------------------------------------------------------
// Suppression — passe par ConfirmModal au lieu de window.confirm().
// -------------------------------------------------------------
const confirmationSuppressionOuverte = ref(false);

const messageConfirmationSuppression = computed(() => {
  const nombre = selection.value.length;
  return nombre === 1
    ? 'Supprimer ce produit définitivement ?'
    : `Supprimer ces ${nombre} produits définitivement ?`;
});

function demanderSuppression() {
  if (selection.value.length === 0) return;
  confirmationSuppressionOuverte.value = true;
}

async function confirmerSuppression() {
  confirmationSuppressionOuverte.value = false;

  const { echecs, archives } = await supprimerProduits(selection.value);

  // On ne garde cochés que les produits dont la suppression a échoué.
  const nomsEchoues = echecs.map((e) => e.nom);
  selection.value = produits.filter((p) => nomsEchoues.includes(p.nom)).map((p) => p.id);

  const messages = [...archives.map((a) => a.message), ...echecs.map((e) => e.message)];
  if (messages.length > 0) {
    window.alert(messages.join('\n'));
  }
}

const produitFournisseurEnEdition = ref(null);

function ouvrirModificationFournisseur(produit) {
  produitFournisseurEnEdition.value = produit;
}

async function gererEnregistrementFournisseur({ fournisseurNom, fournisseurTel }) {
  try {
    await mettreAJourFournisseur(produitFournisseurEnEdition.value.id, { fournisseurNom, fournisseurTel });
    produitFournisseurEnEdition.value = null;
  } catch (erreur) {
    window.alert(erreur.message);
  }
}

async function gererSuppressionFournisseur() {
  try {
    await mettreAJourFournisseur(produitFournisseurEnEdition.value.id, { fournisseurNom: '', fournisseurTel: '' });
    produitFournisseurEnEdition.value = null;
  } catch (erreur) {
    window.alert(erreur.message);
  }
}
</script>

<style scoped>
.approvisionnement-page__table-wrapper {
  padding: 0 var(--space-xl) var(--space-xl);
}
</style>