<!--
  DetailPertesModal.vue (organism)
  --------------------------------------------------------------
  Rôle : petite fenêtre listant chaque casse (mouvement "casse") de
  la période : produit, quantité, coût (quantité x prix d'achat).

  Props :
    - pertes : [{ produit, quantite, utilisateur, cout }]
    - labelPeriode : texte affiché dans le titre
  Emits :
    - fermer
-->
<template>
  <div class="detail-mouvement-modal__overlay" @click.self="$emit('fermer')">
    <div class="detail-mouvement-modal">
      <div class="detail-mouvement-modal__header">
        <p class="detail-mouvement-modal__titre">Pertes (casse) · {{ labelPeriode }}</p>
        <button type="button" class="detail-mouvement-modal__fermer" aria-label="Fermer" @click="$emit('fermer')">✕</button>
      </div>

      <div class="detail-mouvement-modal__scroll">
        <table class="detail-mouvement-modal__table">
          <thead>
            <tr>
              <th>Produit</th>
              <th class="detail-mouvement-modal__num">Quantité</th>
              <th class="detail-mouvement-modal__num">Coût</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ligne, index) in pertes" :key="index">
              <td class="detail-mouvement-modal__produit">{{ ligne.produit }}</td>
              <td class="detail-mouvement-modal__num">{{ ligne.quantite }}</td>
              <td class="detail-mouvement-modal__num">{{ formatCFA(ligne.cout) }}</td>
            </tr>

            <tr v-if="pertes.length === 0">
              <td colspan="3" class="detail-mouvement-modal__vide">Aucune perte sur cette période.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCFA } from '../../utils/format';

defineProps({
  pertes: { type: Array, required: true },
  labelPeriode: { type: String, required: true },
});

defineEmits(['fermer']);
</script>

<style scoped>
.detail-mouvement-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.detail-mouvement-modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  width: 420px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.detail-mouvement-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.detail-mouvement-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-ink);
  margin: 0;
}

.detail-mouvement-modal__fermer {
  border: none;
  background: transparent;
  color: var(--color-ink-muted);
  font-size: 14px;
  cursor: pointer;
}

.detail-mouvement-modal__scroll {
  overflow-y: auto;
}

.detail-mouvement-modal__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.detail-mouvement-modal__table th {
  text-align: left;
  padding: 6px 8px;
  color: var(--color-ink-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--color-border);
}

.detail-mouvement-modal__num {
  text-align: right;
}

.detail-mouvement-modal__table td {
  padding: 8px;
  border-bottom: 1px solid var(--color-bg-panel-muted);
}

.detail-mouvement-modal__produit {
  font-weight: 600;
  color: var(--color-ink);
}

.detail-mouvement-modal__vide {
  text-align: center;
  font-style: italic;
  color: var(--color-ink-muted);
  padding: var(--space-lg);
}
</style>