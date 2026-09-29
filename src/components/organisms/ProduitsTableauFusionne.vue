<!--
  ProduitsTableauFusionne.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau fusionné Produit/Dépenses/Ventes/Bilan pour le
  gérant (colonnes DÉPENSES incluses — réservées au gérant, voir
  ProduitsTableauFusionneVendeur pour l'équivalent sans cette
  colonne). Une colonne Casses optionnelle (avecCasses: true)
  affiche la quantité déjà cassée/signalée aujourd'hui (lecture
  seule : la casse elle-même se signale depuis le Catalogue vendeur,
  ce qui déduit automatiquement le stock — voir ajusterStock dans le
  store produits) et déduite du stock final en plus des ventes.

  Props :
    - products : [{ nom, categorie, stockInitial, prixAchatUnitaire,
                     prixAchatTotal, prixVenteUnitaire, qteVendue,
                     venteTotal, seuilAlerte, qteCasse (optionnel) }]
    - avecCasses : Boolean, false par défaut
-->
<template>
  <div class="produits-fusionne">
    <div class="produits-fusionne__scroll">
      <table class="produits-fusionne__table">
        <thead>
          <tr>
            <th colspan="3" class="produits-fusionne__group produits-fusionne__group--vert">PRODUIT</th>
            <th colspan="2" class="produits-fusionne__group produits-fusionne__group--tan">DÉPENSES</th>
            <th colspan="3" class="produits-fusionne__group produits-fusionne__group--vert">VENTES</th>
            <th v-if="avecCasses" colspan="1" class="produits-fusionne__group produits-fusionne__group--burgundy">CASSES</th>
            <th colspan="3" class="produits-fusionne__group produits-fusionne__group--tan">BILAN</th>
          </tr>
          <tr class="produits-fusionne__subheader">
            <th>Nom</th>
            <th>Catégorie</th>
            <th class="produits-fusionne__num">Stock init.</th>
            <th class="produits-fusionne__num produits-fusionne__sep">Prix unit.</th>
            <th class="produits-fusionne__num">Achat total</th>
            <th class="produits-fusionne__num produits-fusionne__sep">Prix unit.</th>
            <th class="produits-fusionne__num">Qté</th>
            <th class="produits-fusionne__num">Vente total</th>
            <th v-if="avecCasses" class="produits-fusionne__num produits-fusionne__sep">Qté cassée</th>
            <th class="produits-fusionne__num produits-fusionne__sep">Stock final</th>
            <th class="produits-fusionne__num">Seuil</th>
            <th class="produits-fusionne__center">Appro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowsAvecStatut" :key="row.nom">
            <td class="produits-fusionne__nom">{{ row.nom }}</td>
            <td><BadgeCategorie :label="row.categorie" /></td>
            <td class="produits-fusionne__num">{{ row.stockInitial }}</td>
            <td class="produits-fusionne__num produits-fusionne__sep">{{ formatCFA(row.prixAchatUnitaire) }}</td>
            <td class="produits-fusionne__num">{{ formatCFA(row.prixAchatTotal) }}</td>
            <td class="produits-fusionne__num produits-fusionne__sep">{{ formatCFA(row.prixVenteUnitaire) }}</td>
            <td class="produits-fusionne__num">{{ row.qteVendue }}</td>
            <td class="produits-fusionne__num">{{ formatCFA(row.venteTotal) }}</td>
            <td
              v-if="avecCasses"
              class="produits-fusionne__num produits-fusionne__sep"
              :class="{ 'produits-fusionne__value--casse': row.qteCasse }"
            >
              {{ row.qteCasse || 0 }}
            </td>
            <td
              class="produits-fusionne__num produits-fusionne__sep"
              :class="{ 'produits-fusionne__value--alert': row.statut }"
            >
              {{ row.stockFinal }}
            </td>
            <td class="produits-fusionne__num">{{ row.seuilAlerte }}</td>
            <td class="produits-fusionne__center"><PastilleStatut :statut="row.statut" /></td>
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
  avecCasses: { type: Boolean, default: false },
});

const rowsAvecStatut = computed(() =>
  props.products.map((p) => {
    const stockFinal = props.avecCasses
      ? p.stockInitial - p.qteVendue - (p.qteCasse || 0)
      : p.stockInitial - p.qteVendue;
    const statut = stockFinal === 0 ? 'rupture' : stockFinal <= p.seuilAlerte ? 'sous-seuil' : null;
    return { ...p, stockFinal, statut };
  })
);
</script>

<style scoped>
.produits-fusionne {
  width: 100%;
  box-sizing: border-box;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
}

.produits-fusionne__scroll {
  overflow-x: auto;
}

.produits-fusionne__table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.produits-fusionne__group {
  text-align: left;
  padding: var(--space-sm) var(--space-xs) var(--space-xs);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  color: var(--color-ink-muted);
}

.produits-fusionne__group--vert { border-bottom: 2px solid var(--color-green); }
.produits-fusionne__group--tan { border-bottom: 2px solid var(--color-tan); border-left: 1px solid var(--color-border); }
.produits-fusionne__group--burgundy { border-bottom: 2px solid var(--color-burgundy); border-left: 1px solid var(--color-border); }

.produits-fusionne__subheader th {
  text-align: right;
  padding: var(--space-xs) var(--space-sm);
  color: var(--color-ink-muted);
  font-weight: 500;
  font-size: 0.72rem;
}

.produits-fusionne__subheader th:first-child,
.produits-fusionne__subheader th:nth-child(2) {
  text-align: left;
}

.produits-fusionne__sep { border-left: 1px solid var(--color-border); }
.produits-fusionne__num { text-align: right; }
.produits-fusionne__center { text-align: center; }

.produits-fusionne__table td {
  padding: var(--space-sm);
  border-top: 1px solid var(--color-bg-panel-muted);
}

.produits-fusionne__nom {
  font-weight: 600;
  color: var(--color-ink);
}

.produits-fusionne__value--alert {
  color: var(--color-burgundy);
  font-weight: 700;
}

.produits-fusionne__value--casse {
  color: var(--color-burgundy);
  font-weight: 700;
}
</style>