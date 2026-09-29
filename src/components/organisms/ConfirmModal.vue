<!--
  ConfirmModal.vue (organism)
  --------------------------------------------------------------
  Rôle : remplace window.confirm() par une fenêtre de confirmation
  stylée cohérente avec le reste de l'appli.

  Props :
    - titre (optionnel)
    - message
    - texte-confirmer / texte-annuler (optionnels)
    - danger (bool) : bouton de confirmation en rouge (suppression)
  Emits :
    - confirmer
    - annuler
-->
<template>
  <div class="confirm-modal__overlay" @click.self="$emit('annuler')">
    <div class="confirm-modal">
      <p v-if="titre" class="confirm-modal__titre">{{ titre }}</p>
      <p class="confirm-modal__message">{{ message }}</p>

      <div class="confirm-modal__actions">
        <button type="button" class="confirm-modal__annuler" @click="$emit('annuler')">
          {{ texteAnnuler }}
        </button>
        <button
          type="button"
          class="confirm-modal__confirmer"
          :class="{ 'confirm-modal__confirmer--danger': danger }"
          @click="$emit('confirmer')"
        >
          {{ texteConfirmer }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titre: { type: String, default: '' },
  message: { type: String, required: true },
  texteConfirmer: { type: String, default: 'Confirmer' },
  texteAnnuler: { type: String, default: 'Annuler' },
  danger: { type: Boolean, default: false },
});

defineEmits(['confirmer', 'annuler']);
</script>

<style scoped>
.confirm-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.confirm-modal {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  width: 100%;
  max-width: 360px;
}

.confirm-modal__titre {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-ink);
}

.confirm-modal__message {
  margin: 0;
  font-size: 13.5px;
  color: var(--color-ink);
  line-height: 1.5;
}

.confirm-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.confirm-modal__annuler {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-ink-muted);
  cursor: pointer;
}

.confirm-modal__confirmer {
  background: var(--color-green);
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #DDE6DA;
  cursor: pointer;
}

.confirm-modal__confirmer--danger {
  background: #b3251d;
  color: #F7E3E1;
}
</style>