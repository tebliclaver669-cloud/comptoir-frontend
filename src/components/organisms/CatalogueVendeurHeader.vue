<!--
  CatalogueVendeurHeader.vue (organism)
  --------------------------------------------------------------
  Rôle : bandeau du haut de la page Catalogue vendeur. Séparé de
  CatalogueHeader (version gérant) plutôt que rendu conditionnel :
  le vendeur n'a pas les boutons "Ajouter/Supprimer produit"
  (droits différents), et a à la place un bouton panier qui ouvre
  la page de vente -> ce sont deux blocs d'actions de nature
  différente, pas juste un style différent.

  Props :
    - role, nom : transmis à UserBadge
  Emits :
    - panier-click : au clic sur le bouton panier (ouvre la page
      de vente, où le vendeur enregistre une transaction)
-->
<template>
  <header class="catalogue-vendeur-header">
    <h1 class="catalogue-vendeur-header__title">CATALOGUE<br />PRODUIT</h1>

    <div class="catalogue-vendeur-header__actions">
      <UserBadge :role="role" :nom="nom" />
      <RoundIconButton icon="🛒" label="Ouvrir la page de vente" @click="$emit('panier-click')" />
    </div>
  </header>
</template>

<script setup>
import UserBadge from '../molecules/UserBadge.vue';
import RoundIconButton from '../atoms/RoundIconButton.vue';

defineProps({
  role: { type: String, required: true },
  nom: { type: String, required: true },
});
defineEmits(['panier-click']);
</script>

<style scoped>
.catalogue-vendeur-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-lg) var(--space-xl) 0;
}

.catalogue-vendeur-header__title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 2rem;
  line-height: 1.15;
  margin: 0;
}

.catalogue-vendeur-header__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-md);
}
</style>
