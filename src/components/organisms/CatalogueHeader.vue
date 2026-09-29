<!--
  CatalogueHeader.vue (organism)
  --------------------------------------------------------------
  Rôle : titre + badge Gérant en haut de la page Catalogue. Les
  boutons "Ajouter produit" et "Supprimer" ont été retirés : cette
  page ne sert plus qu'à consulter et ajuster les prix/seuils, pas
  à créer ou supprimer des produits.

  Props :
    - role, nom : transmis à UserBadge
-->
<template>
  <header class="catalogue-header">
    <div class="catalogue-header__top">
      <div>
        <h1 class="catalogue-header__title">Catalogue produits</h1>
        <p class="catalogue-header__subtitle">Consultez vos produits et ajustez prix et seuils d'alerte</p>
      </div>
      <UserBadge :role="role" :nom="nom" />
    </div>
  </header>
</template>

<script setup>
import UserBadge from '../molecules/UserBadge.vue';

defineProps({
  role: { type: String, required: true },
  nom: { type: String, required: true },
});
</script>

<style scoped>
.catalogue-header {
  padding: var(--space-lg) var(--space-xl) 0;
}

.catalogue-header__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.catalogue-header__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.catalogue-header__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 0;
}
</style>