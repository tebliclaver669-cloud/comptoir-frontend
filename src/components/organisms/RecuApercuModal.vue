<!--
  RecuApercuModal.vue (organism)
  --------------------------------------------------------------
  Rôle : aperçu du reçu AVANT impression — ouvert depuis le bouton
  "Reçu" de HistoriqueTable (colonne Reçu, lignes de vente
  uniquement). Affiche le même contenu que le reçu papier (produit,
  quantité, prix unitaire, total, date/heure, vendeur), pour que le
  vendeur puisse vérifier avant de lancer l'impression réelle —
  utile en particulier si un client redemande son reçu longtemps
  après la vente.

  Props :
    - vente : { produit, quantite, total, date, heure, utilisateur }
    - nomEntreprise : String
  Emits :
    - imprimer, fermer
-->
<template>
  <div class="recu-apercu-modal__overlay" @click.self="$emit('fermer')">
    <div class="recu-apercu-modal">
      <p class="recu-apercu-modal__titre">Aperçu du reçu</p>

      <div class="recu-apercu-modal__recu">
        <p class="recu-apercu-modal__entreprise">{{ nomEntreprise }}</p>
        <p class="recu-apercu-modal__sous-titre">Reçu de vente</p>

        <div class="recu-apercu-modal__ligne">
          <span>Date</span>
          <span>{{ vente.date }} à {{ vente.heure }}</span>
        </div>
        <div class="recu-apercu-modal__ligne">
          <span>Vendeur</span>
          <span>{{ vente.utilisateur }}</span>
        </div>

        <hr class="recu-apercu-modal__separateur">

        <div class="recu-apercu-modal__ligne">
          <span>{{ vente.produit }}</span>
          <span>× {{ vente.quantite }}</span>
        </div>
        <div class="recu-apercu-modal__ligne">
          <span>Prix unitaire</span>
          <span>{{ formatCFA(prixUnitaire) }}</span>
        </div>

        <hr class="recu-apercu-modal__separateur">

        <div class="recu-apercu-modal__ligne recu-apercu-modal__ligne--total">
          <span>Total</span>
          <span>{{ formatCFA(vente.total || 0) }}</span>
        </div>
      </div>

      <div class="recu-apercu-modal__actions">
        <button type="button" class="recu-apercu-modal__annuler" @click="$emit('fermer')">Fermer</button>
        <button type="button" class="recu-apercu-modal__imprimer" @click="$emit('imprimer')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9V2h12v7" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatCFA } from '../../utils/format';

const props = defineProps({
  vente: { type: Object, required: true },
  nomEntreprise: { type: String, required: true },
});
defineEmits(['imprimer', 'fermer']);

const prixUnitaire = computed(() =>
  props.vente.prixUnitaire ?? (props.vente.quantite ? Math.round((props.vente.total || 0) / props.vente.quantite) : 0)
);
</script>

<style scoped>
.recu-apercu-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.recu-apercu-modal {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  width: 100%;
  max-width: 340px;
}

.recu-apercu-modal__titre {
  margin: 0 0 var(--space-md);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
}

.recu-apercu-modal__recu {
  background: var(--color-bg-panel-muted);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-md);
  font-family: var(--font-mono);
}

.recu-apercu-modal__entreprise {
  margin: 0;
  text-align: center;
  font-weight: 700;
  font-size: 13.5px;
  color: var(--color-ink);
}

.recu-apercu-modal__sous-titre {
  margin: 2px 0 12px;
  text-align: center;
  font-size: 11px;
  color: var(--color-ink-muted);
}

.recu-apercu-modal__ligne {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: var(--color-ink);
  margin: 5px 0;
}

.recu-apercu-modal__ligne--total {
  font-weight: 700;
  font-size: 13.5px;
}

.recu-apercu-modal__separateur {
  border: none;
  border-top: 1px dashed var(--color-border);
  margin: 10px 0;
}

.recu-apercu-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.recu-apercu-modal__annuler {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-ink-muted);
  cursor: pointer;
}

.recu-apercu-modal__imprimer {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-green);
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #DDE6DA;
  cursor: pointer;
}
</style>