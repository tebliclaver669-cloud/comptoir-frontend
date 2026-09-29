<!--
  ProduitsTableauFusionneVendeur.vue (organism)
  --------------------------------------------------------------
  Rôle : équivalent de ProduitsTableauFusionne (gérant) pour le
  vendeur. Pas de colonne Dépenses (prix d'achat réservé au gérant),
  remplacée par CASSES : quantité de produit perdue/cassée signalée
  aujourd'hui (lecture seule — la casse se signale depuis "Signaler
  une casse" sur le Catalogue vendeur, ce qui déduit automatiquement
  le stock, voir ajusterStock dans le store produits). Une casse est
  déduite du stock final au même titre qu'une vente, mais n'est PAS
  une vente (pas de recette associée) :
    stockFinal = stockInitial - qteVendue - qteCasse

  Props :
    - products : [{ nom, categorie, stockInitial, prixVenteUnitaire,
                    qteVendue, venteTotal, qteCasse, seuilAlerte }]
-->
<template>
  <div class="produits-fusionne-vendeur">
    <div class="produits-fusionne-vendeur__scroll">
      <table class="produits-fusionne-vendeur__table">
        <thead>
          <tr>
            <th colspan="3" class="produits-fusionne-vendeur__group produits-fusionne-vendeur__group--vert">PRODUIT</th>
            <th colspan="3" class="produits-fusionne-vendeur__group produits-fusionne-vendeur__group--vert">VENTES</th>
            <th colspan="1" class="produits-fusionne-vendeur__group produits-fusionne-vendeur__group--burgundy">CASSES</th>
            <th colspan="3" class="produits-fusionne-vendeur__group produits-fusionne-vendeur__group--tan">BILAN</th>
          </tr>
          <tr class="produits-fusionne-vendeur__subheader">
            <th>Nom</th>
            <th>Catégorie</th>
            <th class="produits-fusionne-vendeur__num">Stock init.</th>
            <th class="produits-fusionne-vendeur__num produits-fusionne-vendeur__sep">Prix unit.</th>
            <th class="produits-fusionne-vendeur__num">Qté</th>
            <th class="produits-fusionne-vendeur__num">Total</th>
            <th class="produits-fusionne-vendeur__num produits-fusionne-vendeur__sep">Qté cassée</th>
            <th class="produits-fusionne-vendeur__num produits-fusionne-vendeur__sep">Stock final</th>
            <th class="produits-fusionne-vendeur__num">Seuil</th>
            <th class="produits-fusionne-vendeur__center">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowsAvecBilan" :key="row.nom">
            <td class="produits-fusionne-vendeur__nom">{{ row.nom }}</td>
            <td><BadgeCategorie :label="row.categorie" /></td>
            <td class="produits-fusionne-vendeur__num">{{ row.stockInitial }}</td>
            <td class="produits-fusionne-vendeur__num produits-fusionne-vendeur__sep">{{ formatCFA(row.prixVenteUnitaire) }}</td>
            <td class="produits-fusionne-vendeur__num">{{ row.qteVendue }}</td>
            <td class="produits-fusionne-vendeur__num">{{ formatCFA(row.venteTotal) }}</td>
            <td
              class="produits-fusionne-vendeur__num produits-fusionne-vendeur__sep"
              :class="{ 'produits-fusionne-vendeur__value--casse': row.qteCasse }"
            >
              {{ row.qteCasse || 0 }}
            </td>
            <td
              class="produits-fusionne-vendeur__num produits-fusionne-vendeur__sep"
              :class="{ 'produits-fusionne-vendeur__value--alert': row.statut }"
            >
              {{ row.stockFinal }}
            </td>
            <td class="produits-fusionne-vendeur__num">{{ row.seuilAlerte }}</td>
            <td class="produits-fusionne-vendeur__center"><PastilleStatut :statut="row.statut" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BadgeCategorie from '../atoms/BadgeCategorie.vue';
import PastilleStatut from '../atoms/PastilleStatut.vue';
import { formatCFA } from '../../utils/format';

const props = defineProps({
  products: { type: Array, required: true },
});

const rowsAvecBilan = computed(() =>
  props.products.map((p) => {
    const stockFinal = p.stockInitial - p.qteVendue - (p.qteCasse || 0);
    const statut = stockFinal === 0 ? 'rupture' : stockFinal <= p.seuilAlerte ? 'sous-seuil' : null;
    return { ...p, stockFinal, statut };
  })
);
</script>

<style scoped>
.produits-fusionne-vendeur {
  width: 100%;
  box-sizing: border-box;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
}

.produits-fusionne-vendeur__scroll {
  overflow-x: auto;
}

.produits-fusionne-vendeur__table {
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.produits-fusionne-vendeur__group {
  text-align: left;
  padding: var(--space-sm) var(--space-xs) var(--space-xs);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  color: var(--color-ink-muted);
}

.produits-fusionne-vendeur__group--vert { border-bottom: 2px solid var(--color-green); }
.produits-fusionne-vendeur__group--burgundy { border-bottom: 2px solid var(--color-burgundy); border-left: 1px solid var(--color-border); }
.produits-fusionne-vendeur__group--tan { border-bottom: 2px solid var(--color-tan); border-left: 1px solid var(--color-border); }

.produits-fusionne-vendeur__subheader th {
  text-align: right;
  padding: var(--space-xs) var(--space-sm);
  color: var(--color-ink-muted);
  font-weight: 500;
  font-size: 0.72rem;
}

.produits-fusionne-vendeur__subheader th:first-child,
.produits-fusionne-vendeur__subheader th:nth-child(2) {
  text-align: left;
}

.produits-fusionne-vendeur__sep { border-left: 1px solid var(--color-border); }
.produits-fusionne-vendeur__num { text-align: right; }
.produits-fusionne-vendeur__center { text-align: center; }

.produits-fusionne-vendeur__table td {
  padding: var(--space-sm);
  border-top: 1px solid var(--color-bg-panel-muted);
}

.produits-fusionne-vendeur__nom {
  font-weight: 600;
  color: var(--color-ink);
}

.produits-fusionne-vendeur__value--alert {
  color: var(--color-burgundy);
  font-weight: 700;
}

.produits-fusionne-vendeur__value--casse {
  color: var(--color-burgundy);
  font-weight: 700;
}
</style>