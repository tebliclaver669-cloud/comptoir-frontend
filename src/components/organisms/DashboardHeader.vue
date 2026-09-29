<!--
  DashboardHeader.vue (organism)
  --------------------------------------------------------------
  Rôle : bandeau du haut : date + badge gérant sur une ligne, puis
  titre "Tableau de Bord" et sous-titre descriptif.

  Props :
    - date, titre, sousTitre : textes affichés
    - role, nom : transmis à UserBadge
-->
<template>
  <header class="dashboard-header">
    <div class="dashboard-header__top">
      <span class="dashboard-header__date">{{ date }}</span>
      <UserBadge :role="role" :nom="nom" />
    </div>
    <h2 class="dashboard-header__title">{{ titre }}</h2>
    <p class="dashboard-header__subtitle">{{ sousTitre }}</p>
  </header>
</template>

<script setup>
import UserBadge from '../molecules/UserBadge.vue';

defineProps({
  date: { type: String, required: true },
  titre: { type: String, required: true },
  sousTitre: { type: String, required: true },
  role: { type: String, required: true },
  nom: { type: String, required: true },
});
</script>

<style scoped>
.dashboard-header {
  padding: var(--space-lg) var(--space-xl) 0;
}

.dashboard-header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header__date {
  font-style: italic;
  font-size: 0.9rem;
}

.dashboard-header__title {
  margin: var(--space-md) 0 var(--space-xs);
}

.dashboard-header__subtitle {
  margin: 0 0 var(--space-md);
  font-style: italic;
  color: var(--color-text-muted);
}
</style>
