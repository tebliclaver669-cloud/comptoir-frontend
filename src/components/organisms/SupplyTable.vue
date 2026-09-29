<!--
  SupplyTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau de l'Approvisionnement. La colonne Fournisseur a
  maintenant un petit bouton crayon pour modifier ou retirer le
  fournisseur de CE produit (via ModifierFournisseurModal, ouverte
  par la page parente). La colonne "Dernier ajout" résume la
  dernière quantité entrée en stock pour ce produit — qu'il s'agisse
  de son stock initial (produit nouvellement créé) ou d'un
  réapprovisionnement — avec la date et l'heure juste en dessous.

  Props :
    - products : [{ nom, fournisseurNom, fournisseurTel, categorie,
                    prixAchat, stock, seuilAlerte, statut, statutLabel,
                    derniereEntree: { quantite, date, heure } | null }]
  Emits :
    - valider(product, quantite)
    - modifier-fournisseur(product)
-->
<template>
  <div class="supply-table-wrap">
    <table class="supply-table">
      <thead>
        <tr>
          <th class="supply-table__case">
            <input
              type="checkbox"
              aria-label="Tout sélectionner"
              :checked="toutEstSelectionne"
              @change="basculerTout($event.target.checked)"
            >
          </th>
          <th>Fournisseur</th>
          <th>Produit</th>
          <th>Catégorie</th>
          <th class="supply-table__num">Prix d'achat</th>
          <th class="supply-table__num">Stock</th>
          <th class="supply-table__center">Dernier ajout</th>
          <th class="supply-table__center">Statut</th>
          <th class="supply-table__center">Réception</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.nom">
          <td class="supply-table__case">
            <input
              type="checkbox"
              :aria-label="`Sélectionner ${product.nom}`"
              :checked="selection.includes(product.id)"
              @change="basculerProduit(product.id, $event.target.checked)"
            >
          </td>
          <td>
            <div class="supply-table__fournisseur">
              <div>
                <div class="supply-table__fournisseur-nom">{{ product.fournisseurNom || '—' }}</div>
                <div class="supply-table__fournisseur-tel">{{ product.fournisseurTel }}</div>
              </div>
              <button
                type="button"
                class="supply-table__fournisseur-modifier"
                aria-label="Modifier le fournisseur"
                @click="$emit('modifier-fournisseur', product)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2.2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                </svg>
              </button>
            </div>
          </td>
          <td class="supply-table__nom">{{ product.nom }}</td>
          <td><BadgeCategorie :label="product.categorie" /></td>
          <td class="supply-table__num">{{ formatCFA(product.prixAchat) }}</td>
          <td class="supply-table__num">{{ product.stock }}</td>
          <td class="supply-table__center">
            <template v-if="product.derniereEntree">
              <div class="supply-table__derniere-entree-qte">+{{ product.derniereEntree.quantite }}</div>
              <div class="supply-table__derniere-entree-date">{{ product.derniereEntree.date }} · {{ product.derniereEntree.heure }}</div>
            </template>
            <span v-else class="supply-table__derniere-entree-vide">—</span>
          </td>
          <td class="supply-table__center"><StatusPill :statut="product.statut" :label="product.statutLabel" /></td>
          <td class="supply-table__center">
            <div class="supply-table__reception">
              <input
                type="number"
                min="1"
                placeholder="Qté"
                class="supply-table__appro-input"
                v-model.number="quantites[product.nom]"
              >
              <button
                type="button"
                class="supply-table__valider"
                :disabled="!quantites[product.nom]"
                @click="$emit('valider', product, quantites[product.nom])"
              >
                Valider
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="products.length === 0">
          <td colspan="9" class="supply-table__vide">Aucun produit ne correspond à cette recherche.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import BadgeCategorie from '../atoms/BadgeCategorie.vue';
import StatusPill from '../atoms/StatusPill.vue';
import { formatCFA } from '../../utils/format';

const props = defineProps({
  products: { type: Array, required: true },
  selection: { type: Array, default: () => [] },
});
const emit = defineEmits(['valider', 'modifier-fournisseur', 'update:selection']);

const quantites = reactive({});

const toutEstSelectionne = computed(
  () => props.products.length > 0 && props.products.every((p) => props.selection.includes(p.id))
);

function basculerProduit(id, coche) {
  const sansCeProduit = props.selection.filter((i) => i !== id);
  emit('update:selection', coche ? [...sansCeProduit, id] : sansCeProduit);
}

// "Tout sélectionner" ne concerne que les produits actuellement
// affichés (donc filtrés par la recherche).
function basculerTout(coche) {
  const idsAffiches = props.products.map((p) => p.id);
  const autres = props.selection.filter((i) => !idsAffiches.includes(i));
  emit('update:selection', coche ? [...autres, ...idsAffiches] : autres);
}
</script>

<style scoped>
.supply-table-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.supply-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.supply-table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  padding: 12px 14px;
  background: var(--color-bg-table-header);
}

.supply-table th.supply-table__num { text-align: right; }
.supply-table th.supply-table__center { text-align: center; }

.supply-table td {
  padding: 13px 14px;
  border-top: 1px solid var(--color-bg-panel-muted);
}

.supply-table th.supply-table__case,
.supply-table td.supply-table__case {
  width: 34px;
  padding-right: 0;
}

.supply-table__nom {
  font-weight: 600;
  color: var(--color-ink);
}

.supply-table__fournisseur {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.supply-table__fournisseur-nom {
  font-weight: 600;
  color: var(--color-ink);
}

.supply-table__fournisseur-tel {
  font-size: 11px;
  color: var(--color-ink-muted);
}

.supply-table__fournisseur-modifier {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background: var(--color-cream-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.supply-table__num {
  text-align: right;
}

.supply-table__center {
  text-align: center;
}

.supply-table__derniere-entree-qte {
  font-weight: 700;
  color: var(--color-green);
}

.supply-table__derniere-entree-date {
  font-size: 10.5px;
  color: var(--color-ink-muted);
  margin-top: 2px;
}

.supply-table__derniere-entree-vide {
  color: var(--color-ink-muted);
}

.supply-table__reception {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.supply-table__appro-input {
  width: 60px;
  height: 32px;
  text-align: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-cream-light);
  font-weight: 600;
  color: var(--color-ink);
  font-family: var(--font-body);
}

.supply-table__valider {
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 6px;
  background: var(--color-green);
  color: var(--color-text-on-dark);
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
}

.supply-table__valider:disabled {
  background: var(--color-border);
  color: var(--color-ink-muted);
  cursor: not-allowed;
}

.supply-table__vide {
  text-align: center;
  color: var(--color-ink-muted);
  font-style: italic;
  padding: var(--space-xl);
}
</style>