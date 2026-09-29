<!--
  CatalogueVendeurPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/catalogue-vendeur" — point de vente du
  vendeur. Utilise le store partagé produits.js (le même que
  Approvisionnement et les tableaux de bord) au lieu d'une copie
  locale : ainsi, après une vente ou une casse, on recharge CETTE
  liste partagée et toutes les autres pages restent cohérentes sans
  rechargement complet.

  Vente validée -> bandeau de succès -> clic "Voir le reçu" ->
  fenêtre du reçu (impression manuelle, jamais automatique).
-->
<template>
  <GerantPageTemplate role="vendeur">
    <header class="catalogue-vendeur-page__header">
      <div class="catalogue-vendeur-page__header-top">
        <div>
          <h1 class="catalogue-vendeur-page__title">Catalogue produits</h1>
          <p class="catalogue-vendeur-page__subtitle">Sélectionnez un produit pour enregistrer une vente</p>
        </div>
        <UserBadge role="Vendeur" :nom="session.nomUtilisateur.value" />
      </div>
      <div class="catalogue-vendeur-page__actions">
        <button type="button" class="catalogue-vendeur-page__bouton catalogue-vendeur-page__bouton--casse" @click="afficherModaleCasse = true">
          + Signaler une casse
        </button>
        <PanierWidget @vente-validee="gererVenteValidee" />
      </div>
    </header>

    <p v-if="messageErreur" class="catalogue-vendeur-page__erreur">{{ messageErreur }}</p>

    <ProductFilters
      v-model:recherche="recherche"
      v-model:categorie="categorieChoisie"
      v-model:statut="statutChoisi"
      :options-categorie="optionsCategorie"
      :options-statut="optionsStatut"
    />

    <div class="catalogue-vendeur-page__table-wrapper">
      <CatalogueVendeurTable :products="produitsAffiches" />
    </div>

    <div v-if="erreurPanier" class="catalogue-vendeur-page__erreur-bandeau">
      <span>{{ erreurPanier }}</span>
      <button type="button" class="catalogue-vendeur-page__fermer-bandeau" aria-label="Fermer" @click="erreurPanier = ''">
        ✕
      </button>
    </div>

    <div v-if="venteReussieRecemment" class="catalogue-vendeur-page__succes-bandeau">
      <span>Vente enregistrée avec succès.</span>
      <button type="button" class="catalogue-vendeur-page__voir-recu" @click="afficherLeRecu">
        Voir le reçu
      </button>
      <button type="button" class="catalogue-vendeur-page__fermer-bandeau" aria-label="Fermer" @click="venteReussieRecemment = null">
        ✕
      </button>
    </div>

    <SignalerCasseModal
      v-if="afficherModaleCasse"
      :products="produitsDuStore"
      @signaler="gererSignalementCasse"
      @fermer="afficherModaleCasse = false"
    />

    <RecuVenteModal
      v-if="dernierRecu"
      :items="dernierRecu.items"
      :total="dernierRecu.total"
      :date-heure="dernierRecu.dateHeure"
      @fermer="dernierRecu = null"
    />
  </GerantPageTemplate>
</template>

<script setup>
import { computed, ref } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import UserBadge from '../components/molecules/UserBadge.vue';
import PanierWidget from '../components/organisms/PanierWidget.vue';
import ProductFilters from '../components/organisms/ProductFilters.vue';
import CatalogueVendeurTable from '../components/organisms/CatalogueVendeurTable.vue';
import SignalerCasseModal from '../components/organisms/SignalerCasseModal.vue';
import RecuVenteModal from '../components/organisms/RecuVenteModal.vue';
import { listerProduits, chargerProduits } from '../store/produits';
import { post } from '../services/api';
import { viderPanier } from '../store/panier';
import { useSession } from '../store/session';

const session = useSession();

// Catalogue partagé (le même que Approvisionnement/Tableaux de bord),
// déjà chargé au montage par GerantPageTemplate.
const produitsDuStore = listerProduits();

const messageErreur = ref('');

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

const produitsAvecStatut = computed(() =>
  produitsDuStore.map((p) => {
    const statut = calculerStatut(p);
    return { ...p, statut, statutLabel: STATUTS[statut] };
  })
);

// Filtres
const recherche = ref('');
const categorieChoisie = ref('');
const statutChoisi = ref('');

// ProductFilters attend des options { value, label } — avec une
// première entrée "Toutes/Tous" pour pouvoir revenir en arrière une
// fois un filtre choisi.
const optionsCategorie = computed(() => [
  { value: '', label: 'Toutes catégories' },
  ...[...new Set(produitsDuStore.map((p) => p.categorie).filter(Boolean))].map((c) => ({ value: c, label: c })),
]);
const optionsStatut = computed(() => [
  { value: '', label: 'Tous statuts' },
  ...[...new Set(produitsAvecStatut.value.map((p) => p.statutLabel).filter(Boolean))].map((s) => ({ value: s, label: s })),
]);

const produitsAffiches = computed(() => {
  const terme = recherche.value.trim().toLowerCase();
  return produitsAvecStatut.value.filter((p) => {
    const okRecherche = !terme || p.nom.toLowerCase().includes(terme);
    const okCategorie = !categorieChoisie.value || p.categorie === categorieChoisie.value;
    const okStatut = !statutChoisi.value || p.statutLabel === statutChoisi.value;
    return okRecherche && okCategorie && okStatut;
  });
});

// Dates
function dateHeureActuelles() {
  const maintenant = new Date();
  return {
    date: maintenant.toLocaleDateString('fr-FR'),
    heure: maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };
}

// État du reçu / des messages liés au panier
const venteReussieRecemment = ref(null);
const dernierRecu = ref(null);
const erreurPanier = ref('');

function afficherLeRecu() {
  dernierRecu.value = venteReussieRecemment.value;
  venteReussieRecemment.value = null;
}

// items reçus du PanierWidget : [{ nom, quantite, prixUnitaire, remise }]
// (remise déjà répartie ligne par ligne côté panier)
async function gererVenteValidee(items) {
  erreurPanier.value = '';

  const itemsPourApi = [];
  for (const item of items) {
    const produit = produitsDuStore.find((p) => p.nom === item.nom);
    if (!produit) {
      erreurPanier.value = `Produit "${item.nom}" introuvable dans le catalogue actuel — le catalogue a peut-être changé, réessayez.`;
      return;
    }
    itemsPourApi.push({ produitId: produit.id, quantite: item.quantite, remise: item.remise || 0 });
  }

  try {
    const ventesCreees = await post('/ventes/panier', {
      nomEntreprise: session.nomEntreprise.value,
      items: itemsPourApi,
    });

    const { date, heure } = dateHeureActuelles();
    const itemsAvecPrix = ventesCreees.map((v) => {
      const produit = produitsDuStore.find((p) => p.id === v.produitId);
      return { nom: produit ? produit.nom : '—', quantite: v.quantite, prixUnitaire: v.prixUnitaire };
    });
    // Total NET (après remise) : c'est ce montant qui doit apparaître
    // sur le reçu, puisque c'est ce que le client paie réellement.
    const totalBrut = ventesCreees.reduce((s, v) => s + v.total, 0);
    const remiseTotale = ventesCreees.reduce((s, v) => s + (v.remise || 0), 0);
    const total = totalBrut - remiseTotale;

    venteReussieRecemment.value = { items: itemsAvecPrix, total, dateHeure: `${date} à ${heure}` };

    // Vente confirmée par le serveur -> on peut vider le panier
    // maintenant (et pas avant).
    viderPanier();

    // Le stock a changé côté backend -> on recharge le catalogue
    // partagé (Approvisionnement et les tableaux de bord verront
    // aussi la mise à jour dès leur prochain montage).
    await chargerProduits(session.nomEntreprise.value);
  } catch (erreur) {
    if (erreur.statut === 409 && erreur.donnees?.produitsProblematiques) {
      const details = erreur.donnees.produitsProblematiques
        .map((p) => p.message || `Produit "${p.nom || p.produitId}" indisponible.`)
        .join(' ');
      erreurPanier.value = `Vente refusée : ${details} Retirez ces produits du panier puis revalidez pour le reste.`;
    } else {
      erreurPanier.value = erreur.message;
    }
  }
}

const afficherModaleCasse = ref(false);

async function gererSignalementCasse({ produit, quantite }) {
  messageErreur.value = '';

  const produitTrouve = produitsDuStore.find((p) => p.nom === produit);
  if (!produitTrouve) {
    messageErreur.value = `Produit "${produit}" introuvable.`;
    return;
  }

  try {
    await post('/mouvements', {
      nomEntreprise: session.nomEntreprise.value,
      produitId: produitTrouve.id,
      quantite,
      type: 'casse',
    });

    afficherModaleCasse.value = false;
    await chargerProduits(session.nomEntreprise.value);
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

</script>

<style scoped>
.catalogue-vendeur-page__header {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: var(--space-lg) var(--space-xl) var(--space-lg);
}

.catalogue-vendeur-page__header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.catalogue-vendeur-page__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.catalogue-vendeur-page__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 0;
}

.catalogue-vendeur-page__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.catalogue-vendeur-page__bouton {
  height: 38px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.catalogue-vendeur-page__bouton--casse {
  background: var(--color-burgundy);
  color: #F1DAD5;
}

.catalogue-vendeur-page__table-wrapper {
  padding: 0 var(--space-xl);
}

.catalogue-vendeur-page__erreur {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: #b3251d;
  font-style: italic;
}

.catalogue-vendeur-page__succes-bandeau {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: var(--space-md) var(--space-xl) 0;
  padding: 12px 16px;
  background: var(--color-green-soft);
  border: 1px solid #B7CBAF;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #233F1E;
}

.catalogue-vendeur-page__erreur-bandeau {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: var(--space-md) var(--space-xl) 0;
  padding: 12px 16px;
  background: #F7E3E1;
  border: 1px solid #E0B3AE;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #7A241C;
}

.catalogue-vendeur-page__voir-recu {
  margin-left: auto;
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 6px;
  background: var(--color-green);
  color: var(--color-text-on-dark);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.catalogue-vendeur-page__fermer-bandeau {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 13px;
  margin-left: auto;
}
</style>