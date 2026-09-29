<!--
  SidebarBrand.vue (atom)
  --------------------------------------------------------------
  Rôle : logo en haut de la sidebar. Médaillon à double anneau
  (cohérent avec BrandBanner et PublicPageTemplate) + logotype
  "Comptoir" en Fraunces italique. Pas de tagline ici (espace
  restreint de la sidebar).
-->
<template>
  <div class="sidebar-brand">
    <div class="sidebar-brand__logo">
      <svg width="40" height="40" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r="27" fill="none" stroke="#A9825C" stroke-width="1" />
        <circle cx="29" cy="29" r="22" fill="#1C2B37" />
        <circle cx="29" cy="29" r="22" fill="none" stroke="#A9825C" stroke-width="1.4" />
      </svg>
      <span class="sidebar-brand__logo-letter">C</span>
    </div>
    <span class="sidebar-brand__name">Comptoir</span>
  </div>
</template>

<script setup>
// Composant purement visuel.
</script>

<style scoped>
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 var(--space-sm);
}

.sidebar-brand__logo {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.sidebar-brand__logo-letter {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-logo);
  font-style: italic;
  font-weight: 600;
  font-size: 20px;
  color: #C99B6E;
}

.sidebar-brand__name {
  font-family: var(--font-logo);
  font-style: italic;
  font-weight: 600;
  font-size: 19px;
  color: var(--color-text-on-dark);
}
</style>