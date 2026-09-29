<!--
  ProductsTable.vue (organism)
  --------------------------------------------------------------
  Rôle : le tableau principal du catalogue. Reçoit une liste de
  produits déjà filtrée/triée par la page (recherche + filtres
  catégorie/statut appliqués en amont) et l'affiche telle quelle.

  Props :
    - products : [{ nom, categorie, prixAchat, prixVente, stock,
                    seuilAlerte, statut: 'correct'|'bas-du-seuil'|'rupture',
                    statutLabel }]
  Emits :
    - modifier-click(product) : au clic sur le crayon d'une ligne
-->
<template>
  <div class="products-table-wrap">
    <table class="products-table">
      <thead>
        <tr>
          <th>Produit</th>
          <th>Catégorie</th>
          <th class="products-table__num">Prix d'achat</th>
          <th class="products-table__num">Prix de vente</th>
          <th class="products-table__num">Stock</th>
          <th class="products-table__center">Statut</th>
          <th class="products-table__center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.nom">
          <td class="products-table__nom">{{ product.nom }}</td>
          <td><BadgeCategorie :label="product.categorie" /></td>
          <td class="products-table__num">{{ formatCFA(product.prixAchat) }}</td>
          <td class="products-table__num products-table__prix-vente">{{ formatCFA(product.prixVente) }}</td>
          <td class="products-table__num">
            {{ product.stock }} <span class="products-table__seuil">/ seuil {{ product.seuilAlerte }}</span>
          </td>
          <td class="products-table__center"><StatusPill :statut="product.statut" :label="product.statutLabel" /></td>
          <td class="products-table__center">
            <IconButton label="Modifier ce produit" @click="$emit('modifier-click', product)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2.2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
              </svg>
            </IconButton>
          </td>
        </tr>

        <tr v-if="products.length === 0">
          <td colspan="7" class="products-table__vide">Aucun produit ne correspond à cette recherche.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import BadgeCategorie from '../atoms/BadgeCategorie.vue';
import StatusPill from '../atoms/StatusPill.vue';
import IconButton from '../atoms/IconButton.vue';
import { formatCFA } from '../../utils/format';

defineProps({
  products: { type: Array, required: true },
});
defineEmits(['modifier-click']);
</script>

<style scoped>
.products-table-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.products-table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  padding: 12px 16px;
  background: var(--color-bg-table-header);
}

.products-table td {
  padding: 14px 16px;
  border-top: 1px solid var(--color-bg-panel-muted);
}

.products-table__nom {
  font-weight: 600;
  color: var(--color-ink);
}

.products-table__num {
  text-align: right;
}

.products-table__center {
  text-align: center;
}

.products-table__prix-vente {
  font-weight: 600;
}

.products-table__seuil {
  color: var(--color-ink-muted);
  font-weight: 400;
}

.products-table__vide {
  text-align: center;
  color: var(--color-ink-muted);
  font-style: italic;
  padding: var(--space-xl);
}
.products-table th.products-table__num {
  text-align: right;
}

.products-table th.products-table__center {
  text-align: center;
}
</style>