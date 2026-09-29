<!--
  CatalogueVendeurTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau du catalogue vendeur (point de vente). Chaque
  ligne bascule entre le bouton "Vendre" et le mini-formulaire
  QuantiteVenteInline via un état local `produitEnSaisie`
  (au plus une ligne en saisie à la fois).

  Colonne "Stock" : affiche maintenant aussi le seuil d'alerte
  défini par le gérant ("12 / seuil 5"), qui manquait à l'affichage
  bien que la donnée soit déjà là (utilisée pour calculer le
  statut Rupture/Bas du seuil).

  Props :
    - products : [{ nom, categorie, prixVente, qteVendueJour, stock,
                     seuilAlerte, statut, statutLabel }]
-->
<template>
  <div class="catalogue-vendeur-table-wrap">
    <table class="catalogue-vendeur-table">
      <thead>
        <tr>
          <th>Produit</th>
          <th>Catégorie</th>
          <th class="catalogue-vendeur-table__num">Prix de vente</th>
          <th class="catalogue-vendeur-table__num">Vendu</th>
          <th class="catalogue-vendeur-table__num">Stock</th>
          <th class="catalogue-vendeur-table__center">Statut</th>
          <th class="catalogue-vendeur-table__center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.nom">
          <td class="catalogue-vendeur-table__nom">{{ product.nom }}</td>
          <td><BadgeCategorie :label="product.categorie" /></td>
          <td class="catalogue-vendeur-table__num">{{ formatCFA(product.prixVente) }}</td>
          <td class="catalogue-vendeur-table__num">{{ product.qteVendueJour }}</td>
          <td class="catalogue-vendeur-table__num">
            {{ product.stock }} <span class="catalogue-vendeur-table__seuil">/ seuil {{ product.seuilAlerte }}</span>
          </td>
          <td class="catalogue-vendeur-table__center"><StatusPill :statut="product.statut" :label="product.statutLabel" /></td>
          <td class="catalogue-vendeur-table__center">
            <QuantiteVenteInline
              v-if="produitEnSaisie === product.nom"
              :stock-disponible="product.stock"
              @ajouter="(qte) => confirmerAjout(product, qte)"
              @annuler="produitEnSaisie = null"
            />
            <button
              v-else
              type="button"
              class="catalogue-vendeur-table__vendre"
              :disabled="product.stock === 0"
              @click="produitEnSaisie = product.nom"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ product.stock === 0 ? 'Indisponible' : 'Vendre' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BadgeCategorie from '../atoms/BadgeCategorie.vue';
import StatusPill from '../atoms/StatusPill.vue';
import QuantiteVenteInline from '../molecules/QuantiteVenteInline.vue';
import { ajouterAuPanier } from '../../store/panier';
import { formatCFA } from '../../utils/format';

defineProps({
  products: { type: Array, required: true },
});

const produitEnSaisie = ref(null);

function confirmerAjout(product, quantite) {
  ajouterAuPanier({ nom: product.nom, prixVente: product.prixVente }, quantite);
  produitEnSaisie.value = null;
}
</script>

<style scoped>
.catalogue-vendeur-table-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.catalogue-vendeur-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.catalogue-vendeur-table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  padding: 12px 16px;
  background: var(--color-bg-table-header);
}

.catalogue-vendeur-table th.catalogue-vendeur-table__num { text-align: right; }
.catalogue-vendeur-table th.catalogue-vendeur-table__center { text-align: center; }

.catalogue-vendeur-table td {
  padding: 14px 16px;
  border-top: 1px solid var(--color-bg-panel-muted);
}

.catalogue-vendeur-table__nom {
  font-weight: 600;
  color: var(--color-ink);
}

.catalogue-vendeur-table__num { text-align: right; }
.catalogue-vendeur-table__center { text-align: center; }

.catalogue-vendeur-table__seuil {
  color: var(--color-ink-muted);
  font-weight: 400;
}

.catalogue-vendeur-table__vendre {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--color-tan);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: var(--color-ink);
  font-weight: 600;
  font-size: 11.5px;
  cursor: pointer;
}

.catalogue-vendeur-table__vendre:disabled {
  background: var(--color-border);
  color: var(--color-ink-muted);
  cursor: not-allowed;
}
</style>