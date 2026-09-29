<!--
  RecuVenteModal.vue (organism)
  --------------------------------------------------------------
  Rôle : affiche le reçu de la vente qui vient d'être validée
  (articles, quantités, total), avec un bouton "Imprimer" qui
  n'imprime QUE ce reçu (voir @media print dans main.css, classe
  .recu-print) — le reste de l'interface est masqué à l'impression.

  Props :
    - items : [{ nom, quantite, prixUnitaire }]
    - total : number
    - dateHeure : string affichée sur le reçu
  Emits :
    - fermer
-->
<template>
  <div class="recu-modal__overlay" @click.self="$emit('fermer')">
    <div class="recu-modal">
      <div class="recu-print">
        <p class="recu-modal__titre">Comptoir</p>
        <p class="recu-modal__sous-titre">Reçu de vente</p>
        <p class="recu-modal__date">{{ dateHeure }}</p>

        <table class="recu-modal__table">
          <thead>
            <tr>
              <th>Produit</th>
              <th class="recu-modal__num">Qté</th>
              <th class="recu-modal__num">P.U.</th>
              <th class="recu-modal__num">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.nom">
              <td>{{ item.nom }}</td>
              <td class="recu-modal__num">{{ item.quantite }}</td>
              <td class="recu-modal__num">{{ formatCFA(item.prixUnitaire) }}</td>
              <td class="recu-modal__num">{{ formatCFA(item.quantite * item.prixUnitaire) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="recu-modal__total">
          <span>Total</span>
          <span>{{ formatCFA(total) }}</span>
        </div>

        <p class="recu-modal__merci">Merci de votre confiance</p>
      </div>

      <div class="recu-modal__actions">
        <button type="button" class="recu-modal__fermer" @click="$emit('fermer')">Fermer</button>
        <button type="button" class="recu-modal__imprimer" @click="imprimer">Imprimer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCFA } from '../../utils/format';

defineProps({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  dateHeure: { type: String, required: true },
});

defineEmits(['fermer']);

function imprimer() {
  window.print();
}
</script>

<style scoped>
.recu-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.recu-modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  width: 340px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.recu-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 20px;
  color: var(--color-ink);
  margin: 0;
  text-align: center;
}

.recu-modal__sous-titre {
  text-align: center;
  font-size: 12px;
  color: var(--color-ink-muted);
  margin: 2px 0 8px;
}

.recu-modal__date {
  text-align: center;
  font-size: 11px;
  color: var(--color-ink-muted);
  margin: 0 0 var(--space-md);
}

.recu-modal__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: var(--space-md);
}

.recu-modal__table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 9.5px;
  color: var(--color-ink-muted);
  border-bottom: 1px solid var(--color-border);
  padding: 4px;
}

.recu-modal__num { text-align: right; }

.recu-modal__table td {
  padding: 5px 4px;
  border-bottom: 1px solid var(--color-bg-panel-muted);
}

.recu-modal__total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 14px;
  color: var(--color-ink);
  padding-top: 6px;
  border-top: 1px solid var(--color-border);
}

.recu-modal__merci {
  text-align: center;
  font-style: italic;
  font-size: 11px;
  color: var(--color-ink-muted);
  margin: var(--space-md) 0 0;
}

.recu-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: var(--space-lg);
}

.recu-modal__fermer {
  height: 36px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-ink-muted);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
}

.recu-modal__imprimer {
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 4px;
  background: var(--color-green);
  color: var(--color-text-on-dark);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
</style>