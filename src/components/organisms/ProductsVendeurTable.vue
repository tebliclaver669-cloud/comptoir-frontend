<!--
  ProductsVendeurTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau du Catalogue vendeur. Différent de ProductsTable
  (version gérant) sur 3 points liés aux droits du vendeur :
    - pas de colonne "PRIX D'ACHAT" (information réservée au gérant)
    - pas de colonne "ACTION" (le vendeur ne peut pas modifier un
      produit)
    - une colonne "VENDU" en plus (quantité vendue aujourd'hui,
      utile au vendeur pour suivre son activité)
  Séparé de ProductsTable plutôt que rendu conditionnel : les
  colonnes affichées dépendent des droits du rôle, une logique
  assez différente pour mériter son propre composant explicite.

  Props :
    - products : [{ nom, categorie, prixVente, vendu, stock,
                    seuilAlerte, statut, statutLabel }]
-->
<template>
  <table class="products-vendeur-table">
    <thead>
      <tr>
        <th>PRODUIT</th>
        <th>CATEGORIE</th>
        <th>PRIX DE VENTE</th>
        <th>VENDU</th>
        <th>STOCK</th>
        <th>STATUT</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.nom">
        <td class="products-vendeur-table__nom">{{ product.nom }}</td>
        <td><BadgeCategorie :label="product.categorie" /></td>
        <td><strong>{{ formatCFA(product.prixVente) }}</strong></td>
        <td>{{ String(product.vendu).padStart(2, '0') }}</td>
        <td>{{ product.stock }}/ seuil {{ product.seuilAlerte }}</td>
        <td><StatusPill :statut="product.statut" :label="product.statutLabel" /></td>
      </tr>

      <tr v-if="products.length === 0">
        <td colspan="6" class="products-vendeur-table__vide">
          Aucun produit ne correspond à cette recherche.
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import BadgeCategorie from '../atoms/BadgeCategorie.vue';
import StatusPill from '../atoms/StatusPill.vue';
import { formatCFA } from '../../utils/format';

defineProps({
  products: { type: Array, required: true },
});
</script>

<style scoped>
.products-vendeur-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--space-lg);
}

.products-vendeur-table th {
  text-align: left;
  font-size: 0.8rem;
  padding: var(--space-md);
  background: var(--color-bg-panel-muted);
}

.products-vendeur-table td {
  padding: var(--space-md);
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.products-vendeur-table__nom {
  font-weight: 700;
}

.products-vendeur-table__vide {
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
  padding: var(--space-xl);
}
</style>
