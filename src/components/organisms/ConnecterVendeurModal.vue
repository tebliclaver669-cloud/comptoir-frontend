<!--
  ConnecterVendeurModal.vue (organism)
  --------------------------------------------------------------
  Rôle : fenêtre ouverte depuis "+ Ajouter un vendeur" > "Connecter
  un vendeur", pour un vendeur DÉJÀ inscrit qui veut ouvrir sa
  propre session sur cet appareil. C'est le vendeur lui-même qui
  saisit son nom et son mot de passe (pas le gérant) : une
  connexion réussie ouvre une vraie session vendeur, exactement
  comme depuis la page de connexion dédiée.

  Props :
    - erreur : message d'erreur à afficher (nom/mot de passe
               incorrect), géré par le parent
  Emits :
    - connecter({ nom, motDePasse })
    - fermer
-->
<template>
  <div class="connecter-vendeur-modal__overlay" @click.self="$emit('fermer')">
    <div class="connecter-vendeur-modal">
      <div class="connecter-vendeur-modal__header">
        <p class="connecter-vendeur-modal__titre">Connecter un vendeur</p>
        <button type="button" class="connecter-vendeur-modal__fermer" aria-label="Fermer" @click="$emit('fermer')">✕</button>
      </div>

      <p class="connecter-vendeur-modal__aide">
        Le vendeur saisit lui-même son nom et son mot de passe pour ouvrir sa propre session sur cet appareil.
      </p>

      <p v-if="erreur" class="connecter-vendeur-modal__erreur">{{ erreur }}</p>

      <form class="connecter-vendeur-modal__form" @submit.prevent="soumettre">
        <input type="text" class="connecter-vendeur-modal__input" v-model="nom" placeholder="Nom du vendeur" autofocus>
        <input type="password" class="connecter-vendeur-modal__input" v-model="motDePasse" placeholder="Mot de passe">
        <button type="submit" class="connecter-vendeur-modal__submit">Connecter</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  erreur: { type: String, default: '' },
});

const emit = defineEmits(['connecter', 'fermer']);

const nom = ref('');
const motDePasse = ref('');

function soumettre() {
  emit('connecter', { nom: nom.value, motDePasse: motDePasse.value });
}
</script>

<style scoped>
.connecter-vendeur-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.connecter-vendeur-modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  width: 360px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.connecter-vendeur-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.connecter-vendeur-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-ink);
  margin: 0;
}

.connecter-vendeur-modal__fermer {
  border: none;
  background: transparent;
  color: var(--color-ink-muted);
  font-size: 14px;
  cursor: pointer;
}

.connecter-vendeur-modal__aide {
  font-size: 12px;
  color: var(--color-ink-muted);
  margin: 0 0 var(--space-md);
}

.connecter-vendeur-modal__erreur {
  color: #b3251d;
  font-style: italic;
  margin: 0 0 var(--space-md);
  font-size: 13px;
}

.connecter-vendeur-modal__form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.connecter-vendeur-modal__input {
  width: 100%;
  box-sizing: border-box;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-ink);
}

.connecter-vendeur-modal__submit {
  height: 38px;
  border: none;
  border-radius: 4px;
  background: var(--color-tan);
  color: var(--color-ink);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  margin-top: 4px;
}
</style>
