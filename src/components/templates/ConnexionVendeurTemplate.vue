<template>
  <div class="connexion-vendeur-template">
    <TopBanner @help-click="$emit('help-click')" />
    <div class="connexion-vendeur-template__header">
      <p class="connexion-vendeur-template__entreprise">{{ nomEntreprise }}</p>
      <button class="connexion-vendeur-template__link" @click="$emit('inscription-vendeur-click')">
        S'inscrire en tant que vendeur
      </button>
    </div>
    <main class="connexion-vendeur-template__content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import TopBanner from '../organisms/TopBanner.vue';

defineProps({
  nomEntreprise: {
    type: String,
    default: '',
  },
  inscriptionVendeurActive: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['help-click', 'inscription-vendeur-click']);
</script>

<style scoped>
.connexion-vendeur-template {
  min-height: 100vh;
  background: var(--color-bg-page);
}

.connexion-vendeur-template__header {
  background: var(--color-bg-authbar);
  padding: var(--space-md) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.connexion-vendeur-template__entreprise {
  margin: 0;
  font-weight: 700;
  font-style: italic;
}

.connexion-vendeur-template__link {
  background: none;
  border: none;
  color: var(--color-text-main);
  font-weight: 700;
  font-style: italic;
  cursor: pointer;
  text-decoration: underline;
}

.connexion-vendeur-template__content {
  padding: var(--space-xl);
}
</style>
