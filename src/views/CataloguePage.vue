<!--
  CataloguePage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/catalogue". Utilise le store partagé
  produits.js — les produits ajoutés depuis Approvisionnement
  apparaissent ici automatiquement. Consultation + modification
  limitée au prix d'achat, prix de vente et seuil d'alerte,
  persistée CÔTÉ BACKEND (mettreAJourInfosProduit) — avant, seule la
  copie locale était modifiée, donc le seuil revenait à son ancienne
  valeur au rechargement de la page.
-->
<template>
  <GerantPageTemplate>
    <CatalogueHeader role="Gérant" :nom="session.nomUtilisateur.value" />

    <ProductFilters
      v-model:recherche="recherche"
      v-model:categorie="categorieChoisie"
      v-model:statut="statutChoisi"
      :options-categorie="optionsCategorie"
      :options-statut="optionsStatut"
    />

    <div class="catalogue-page__table-wrapper">
      <ProductsTable :products="produitsAffiches" @modifier-click="ouvrirModification" />
    </div>

    <ModifierProduitModal
      v-if="produitEnEdition"
      :produit="produitEnEdition"
      @enregistrer="gererEnregistrementModification"
      @fermer="produitEnEdition = null"
    />
  </GerantPageTemplate>
</template>

<script setup>
import { computed, ref } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import CatalogueHeader from '../components/organisms/CatalogueHeader.vue';
import ProductFilters from '../components/organisms/ProductFilters.vue';
import ProductsTable from '../components/organisms/ProductsTable.vue';
import ModifierProduitModal from '../components/organisms/ModifierProduitModal.vue';
import { listerProduits, mettreAJourInfosProduit } from '../store/produits';
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

const produitsAvecStatut = computed(() =>
  produits.map((p) => {
    const statut = calculerStatut(p);
    return { ...p, statut, statutLabel: STATUTS[statut] };
  })
);

const recherche = ref('');
const categorieChoisie = ref('toutes');
const statutChoisi = ref('tous');

const optionsCategorie = computed(() => {
  const categories = [...new Set(produits.map((p) => p.categorie))];
  return [
    { value: 'toutes', label: 'Toutes les categories' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];
});

const optionsStatut = [
  { value: 'tous', label: 'tous les statuts' },
  { value: 'correct', label: 'Stock correct' },
  { value: 'bas-du-seuil', label: 'Bas du seuil' },
  { value: 'rupture', label: 'Rupture' },
];

const produitsAffiches = computed(() =>
  produitsAvecStatut.value.filter((p) => {
    const correspondRecherche = p.nom.toLowerCase().includes(recherche.value.toLowerCase().trim());
    const correspondCategorie = categorieChoisie.value === 'toutes' || p.categorie === categorieChoisie.value;
    const correspondStatut = statutChoisi.value === 'tous' || p.statut === statutChoisi.value;
    return correspondRecherche && correspondCategorie && correspondStatut;
  })
);

const produitEnEdition = ref(null);

function ouvrirModification(produit) {
  produitEnEdition.value = produit;
}

async function gererEnregistrementModification(nouvellesValeurs) {
  try {
    await mettreAJourInfosProduit(produitEnEdition.value.id, nouvellesValeurs);
    produitEnEdition.value = null;
  } catch (erreur) {
    window.alert(erreur.message);
  }
}
</script>

<style scoped>
.catalogue-page__table-wrapper {
  padding: 0 var(--space-xl);
}
</style>