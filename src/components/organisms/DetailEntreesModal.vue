<!--
  DetailEntreesModal.vue (organism)
  --------------------------------------------------------------
  Rôle : petite fenêtre listant chaque entrée de stock de la
  période (produit, quantité, fournisseur), déclenchée depuis la
  carte "Produits entrés" de MouvementsStatsCard.

  Props :
    - entrees : [{ produit, quantite, fournisseurNom }]
    - labelPeriode : texte affiché dans le titre
  Emits :
    - fermer
-->
<template>
  <div class="detail-entrees-modal__overlay" @click.self="$emit('fermer')">
    <div class="detail-entrees-modal">
      <div class="detail-entrees-modal__header">
        <p class="detail-entrees-modal__titre">Produits entrés · {{ labelPeriode }}</p>
        <button type="button" class="detail-entrees-modal__fermer" aria-label="Fermer" @click="$emit('fermer')">✕</button>
      </div>

      <div class="detail-entrees-modal__scroll">
        <table class="detail-entrees-modal__table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Fournisseur</th>
              <th class="detail-entrees-modal__num">Quantité</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ligne, index) in entrees" :key="index">
              <td class="detail-entrees-modal__produit">{{ ligne.produit }}</td>
              <td>{{ ligne.fournisseurNom || '—' }}</td>
              <td class="detail-entrees-modal__num">{{ ligne.quantite }}</td>
            </tr>

            <tr v-if="entrees.length === 0">
              <td colspan="3" class="detail-entrees-modal__vide">Aucune entrée sur cette période.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  entrees: { type: Array, required: true },
  labelPeriode: { type: String, required: true },
});

defineEmits(['fermer']);
</script>

<style scoped>
.detail-entrees-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.detail-entrees-modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  width: 420px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.detail-entrees-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.detail-entrees-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-ink);
  margin: 0;
}

.detail-entrees-modal__fermer {
  border: none;
  background: transparent;
  color: var(--color-ink-muted);
  font-size: 14px;
  cursor: pointer;
}

.detail-entrees-modal__scroll {
  overflow-y: auto;
}

.detail-entrees-modal__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.detail-entrees-modal__table th {
  text-align: left;
  padding: 6px 8px;
  color: var(--color-ink-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--color-border);
}

.detail-entrees-modal__num {
  text-align: right;
}

.detail-entrees-modal__table td {
  padding: 8px;
  border-bottom: 1px solid var(--color-bg-panel-muted);
}

.detail-entrees-modal__produit {
  font-weight: 600;
  color: var(--color-ink);
}

.detail-entrees-modal__vide {
  text-align: center;
  font-style: italic;
  color: var(--color-ink-muted);
  padding: var(--space-lg);
}
</style>