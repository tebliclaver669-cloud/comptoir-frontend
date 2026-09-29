<!--
  ParametresTabs.vue (molecule)
  --------------------------------------------------------------
  Rôle : barre d'onglets en haut des 3 pages Paramètres, pour
  naviguer entre elles sans repasser par le menu de la sidebar.
  L'onglet actif est déterminé par la route courante.
-->
<template>
  <nav class="parametres-tabs">
    <router-link to="/parametres/entreprise" class="parametres-tabs__tab" active-class="parametres-tabs__tab--active">
      Modifier profil
    </router-link>
    <router-link to="/parametres/securite" class="parametres-tabs__tab" active-class="parametres-tabs__tab--active">
      Sécurité
    </router-link>
    <router-link to="/parametres/vendeurs" class="parametres-tabs__tab" active-class="parametres-tabs__tab--active">
      Gestion des vendeurs
    </router-link>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.parametres-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--color-border);
  margin: 0 var(--space-xl) var(--space-lg);
}

.parametres-tabs__tab {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
}

.parametres-tabs__tab--active {
  color: var(--color-green);
  border-bottom-color: var(--color-green);
  font-weight: 600;
}
</style>