<!--
  SidebarNavItem.vue (molecule)
  --------------------------------------------------------------
  Rôle : une entrée du menu latéral. Petite animation au survol
  (léger glissement vers la droite + icône qui se déplace un peu
  plus vite qu'elle, pour un effet de profondeur) et transition
  douce sur l'état actif.

  Props :
    - to, icon, label
-->
<template>
  <router-link :to="to" class="sidebar-nav-item" active-class="sidebar-nav-item--active">
    <span class="sidebar-nav-item__icon" aria-hidden="true" v-html="icon"></span>
    <span>{{ label }}</span>
  </router-link>
</template>

<script setup>
defineProps({
  to: { type: String, required: true },
  icon: { type: String, default: '' },
  label: { type: String, required: true },
});
</script>

<style scoped>
.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 var(--space-sm);
  padding: 9px 11px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-on-dark);
  font-family: var(--font-interface);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  transition: background-color 0.2s ease, transform 0.2s ease, padding-left 0.2s ease;
}

.sidebar-nav-item:hover {
  background: rgba(169, 130, 92, 0.12);
  transform: translateX(3px);
}

.sidebar-nav-item--active {
  background: var(--color-green);
}

.sidebar-nav-item--active:hover {
  background: var(--color-green);
  transform: translateX(3px);
}

.sidebar-nav-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.sidebar-nav-item:hover .sidebar-nav-item__icon {
  transform: scale(1.12);
}

.sidebar-nav-item__icon :deep(svg) {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}
</style>