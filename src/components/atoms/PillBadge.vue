<!--
  PillBadge.vue (atom)
  --------------------------------------------------------------
  Rôle : bloc arrondi en forme de pilule qui affiche un texte en
  lecture seule (ici le nom de l'entreprise, repris de la page
  d'accueil pour rappeler à l'utilisateur où il se connecte).
  Différent d'un bouton : ce n'est pas cliquable, juste informatif.

  Props :
    - text : texte affiché
-->
<template>
  <div class="pill-badge">{{ text }}</div>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
});
</script>

<style scoped>
.pill-badge {
  background: var(--color-bg-card);
  border-radius: 999px;
  padding: var(--space-md) var(--space-xl);
  font-weight: 800;
  font-style: italic;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
