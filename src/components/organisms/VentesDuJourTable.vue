<!--
  VentesDuJourTable.vue (organism)
  --------------------------------------------------------------
  Rôle : liste des produits vendus aujourd'hui (une ligne par vente),
  avec le total du jour en pied de tableau.

  Props :
    - ventes : [{ id, dateVente, produit, quantite, prixUnitaire,
                  total, vendeur }]
    - erreur : String, message à afficher si le chargement a échoué
-->
<template>
  <section class="ventes-jour">
    <h2 class="ventes-jour__titre">Produits vendus aujourd'hui</h2>

    <div class="ventes-jour__wrap">
      <table class="ventes-jour__table">
        <thead>
          <tr>
            <th>Heure</th>
            <th>Produit</th>
            <th class="ventes-jour__num">Quantité</th>
            <th class="ventes-jour__num">Prix unitaire</th>
            <th class="ventes-jour__num">Total</th>
            <th>Vendeur</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vente in ventes" :key="vente.id">
            <td class="ventes-jour__heure">{{ formaterHeure(vente.dateVente) }}</td>
            <td class="ventes-jour__produit">{{ vente.produit }}</td>
            <td class="ventes-jour__num">{{ vente.quantite }}</td>
            <td class="ventes-jour__num">{{ formatCFA(vente.prixUnitaire) }}</td>
            <td class="ventes-jour__num ventes-jour__total">{{ formatCFA(vente.total) }}</td>
            <td>{{ vente.vendeur }}</td>
          </tr>

          <tr v-if="erreur">
            <td colspan="6" class="ventes-jour__vide">{{ erreur }}</td>
          </tr>
          <tr v-else-if="ventes.length === 0">
            <td colspan="6" class="ventes-jour__vide">Aucun produit vendu aujourd'hui.</td>
          </tr>
        </tbody>
        <tfoot v-if="ventes.length > 0">
          <tr>
            <td colspan="4" class="ventes-jour__pied">Total du jour</td>
            <td class="ventes-jour__num ventes-jour__total">{{ formatCFA(totalDuJour) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { formatCFA } from '../../utils/format';

const props = defineProps({
  ventes: { type: Array, required: true },
  erreur: { type: String, default: '' },
});

const totalDuJour = computed(() => props.ventes.reduce((somme, v) => somme + v.total, 0));

function formaterHeure(dateIso) {
  return new Date(dateIso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.ventes-jour__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 18px;
  color: var(--color-ink);
  margin: 0 0 var(--space-sm);
}

.ventes-jour__wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.ventes-jour__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.ventes-jour__table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  padding: 12px 16px;
  background: var(--color-bg-table-header);
}

.ventes-jour__table td {
  padding: 13px 16px;
  border-top: 1px solid var(--color-bg-panel-muted);
}

.ventes-jour__table th.ventes-jour__num,
.ventes-jour__table td.ventes-jour__num {
  text-align: right;
}

.ventes-jour__heure {
  color: var(--color-ink-muted);
  white-space: nowrap;
}

.ventes-jour__produit {
  font-weight: 600;
  color: var(--color-ink);
}

.ventes-jour__total {
  font-weight: 700;
  color: var(--color-ink);
}

.ventes-jour__pied {
  text-align: right;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-ink-muted);
}

.ventes-jour__vide {
  text-align: center;
  color: var(--color-ink-muted);
  font-style: italic;
  padding: var(--space-xl);
}
</style>
