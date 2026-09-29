<!--
  HistoriqueConnexionsModal.vue (organism)
  --------------------------------------------------------------
  Rôle : fenêtre listant l'historique des connexions/déconnexions
  d'UN vendeur précis, en lecture seule.

  Props :
    - nomVendeur : string
    - historique : [{ type: 'connexion'|'deconnexion', date, heure }]
  Emits :
    - fermer
-->
<template>
  <div class="historique-connexions-modal__overlay" @click.self="$emit('fermer')">
    <div class="historique-connexions-modal">
      <div class="historique-connexions-modal__header">
        <p class="historique-connexions-modal__titre">Connexions de {{ nomVendeur }}</p>
        <button type="button" class="historique-connexions-modal__fermer" aria-label="Fermer" @click="$emit('fermer')">✕</button>
      </div>

      <div class="historique-connexions-modal__scroll">
        <div v-for="(h, index) in historique" :key="index" class="historique-connexions-modal__ligne">
          <span
            class="historique-connexions-modal__pastille"
            :class="h.type === 'connexion' ? 'historique-connexions-modal__pastille--connexion' : 'historique-connexions-modal__pastille--deconnexion'"
          >
            {{ h.type === 'connexion' ? 'Connexion' : 'Déconnexion' }}
          </span>
          <span class="historique-connexions-modal__date">{{ h.date }} à {{ h.heure }}</span>
        </div>

        <p v-if="historique.length === 0" class="historique-connexions-modal__vide">
          Aucune connexion enregistrée pour ce vendeur.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nomVendeur: { type: String, required: true },
  historique: { type: Array, required: true },
});

defineEmits(['fermer']);
</script>

<style scoped>
.historique-connexions-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.historique-connexions-modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  width: 360px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.historique-connexions-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.historique-connexions-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-ink);
  margin: 0;
}

.historique-connexions-modal__fermer {
  border: none;
  background: transparent;
  color: var(--color-ink-muted);
  font-size: 14px;
  cursor: pointer;
}

.historique-connexions-modal__scroll {
  overflow-y: auto;
}

.historique-connexions-modal__ligne {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-bg-panel-muted);
  font-size: 12.5px;
}

.historique-connexions-modal__pastille {
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
}

.historique-connexions-modal__pastille--connexion {
  background: var(--color-green-soft);
  color: #233F1E;
}

.historique-connexions-modal__pastille--deconnexion {
  background: var(--color-bg-panel-muted);
  color: var(--color-ink-muted);
}

.historique-connexions-modal__date {
  color: var(--color-ink-muted);
}

.historique-connexions-modal__vide {
  text-align: center;
  font-style: italic;
  color: var(--color-ink-muted);
  padding: var(--space-lg);
}
</style>