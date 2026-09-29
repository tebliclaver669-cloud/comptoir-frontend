<!--
  TopRightPanel.vue (organism)
  --------------------------------------------------------------
  Rôle : reproduit l'en-tête de la page Approvisionnement, qui n'a
  pas de titre de page (contrairement au Catalogue) : juste le
  badge utilisateur en haut à droite, avec le bouton "Ajouter
  produit" en dessous.

  On le distingue de CatalogueHeader (qui combine un titre à
  gauche + ce même bloc à droite) plutôt que de rendre
  CatalogueHeader "sans titre" via une prop optionnelle : les deux
  mises en page sont assez différentes (avec/sans titre, actions
  simple/multiples) pour rester deux organisms clairs.

  Props :
    - role, nom : transmis à UserBadge
  Emits :
    - ajouter-click
-->
<template>
  <div class="top-right-panel">
    <UserBadge :role="role" :nom="nom" />
    <ActionButton icon="+" label="Ajouter produit" @click="$emit('ajouter-click')" />
  </div>
</template>

<script setup>
import UserBadge from '../molecules/UserBadge.vue';
import ActionButton from '../molecules/ActionButton.vue';

defineProps({
  role: { type: String, required: true },
  nom: { type: String, required: true },
});
defineEmits(['ajouter-click']);
</script>

<style scoped>
.top-right-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-xl) 0;
}
</style>
