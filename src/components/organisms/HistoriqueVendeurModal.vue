<!--
  HistoriqueVendeurModal.vue (organism)
  --------------------------------------------------------------
  Modale affichant l'historique des connexions/déconnexions d'un
  vendeur (GET /api/vendeurs/:nomEntreprise/:id/connexions).
-->
<template>
  <div class="historique-vendeur-modal__overlay" @click.self="$emit('fermer')">
    <div class="historique-vendeur-modal">
      <h2 class="historique-vendeur-modal__titre">Historique de « {{ nomVendeur }} »</h2>

      <p v-if="chargement" class="historique-vendeur-modal__vide">Chargement…</p>
      <p v-else-if="connexions.length === 0" class="historique-vendeur-modal__vide">
        Aucune connexion enregistrée pour le moment.
      </p>

      <ul v-else class="historique-vendeur-modal__liste">
        <li v-for="ligne in connexions" :key="ligne.id" class="historique-vendeur-modal__ligne">
          <span
            class="historique-vendeur-modal__tag"
            :class="`historique-vendeur-modal__tag--${ligne.type}`"
          >
            {{ ligne.type === 'connexion' ? 'Connexion' : 'Déconnexion' }}
          </span>
          <span class="historique-vendeur-modal__date">
            {{ formatDate(ligne.dateHeure) }} à {{ formatHeure(ligne.dateHeure) }}
          </span>
        </li>
      </ul>

      <div class="historique-vendeur-modal__actions">
        <button type="button" class="historique-vendeur-modal__fermer" @click="$emit('fermer')">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nomVendeur: { type: String, required: true },
  connexions: { type: Array, default: () => [] },
  chargement: { type: Boolean, default: false },
});

defineEmits(['fermer']);

function formatDate(dateIso) {
  return new Date(dateIso).toLocaleDateString('fr-FR');
}

function formatHeure(dateIso) {
  return new Date(dateIso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.historique-vendeur-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.historique-vendeur-modal {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  width: 100%;
  max-width: 420px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.historique-vendeur-modal__titre {
  margin: 0 0 var(--space-md);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
  overflow-wrap: break-word;
}

.historique-vendeur-modal__vide {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  font-style: italic;
}

.historique-vendeur-modal__liste {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.historique-vendeur-modal__ligne {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-bg-panel-muted);
  font-size: 12.5px;
}

.historique-vendeur-modal__tag {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 2px;
  flex-shrink: 0;
  color: #DDE6DA;
}

.historique-vendeur-modal__tag--connexion {
  background: var(--color-green);
}

.historique-vendeur-modal__tag--deconnexion {
  background: var(--color-ink-muted);
}

.historique-vendeur-modal__date {
  color: var(--color-ink);
  font-family: var(--font-mono);
}

.historique-vendeur-modal__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-md);
}

.historique-vendeur-modal__fermer {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-ink-muted);
  cursor: pointer;
}
</style>