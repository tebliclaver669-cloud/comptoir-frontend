<!--
  UserBadge.vue (atom+ish molecule)
  --------------------------------------------------------------
  Rôle : la pilule "Profil (Claver)" en haut à droite de l'espace
  gérant/vendeur, avec une icône silhouette. Affiche toujours
  "Profil" suivi du nom entre parenthèses, quel que soit le rôle
  (le rôle reste disponible en prop pour un usage futur mais n'est
  plus affiché ici).

  Props :
    - role : "Gérant" ou "Vendeur"
    - nom  : nom affiché
-->
<template>
  <div class="user-badge">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2B2620" stroke-width="2.4">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
    <span>Profil ({{ nom }})</span>
  </div>
</template>

<script setup>
defineProps({
  role: { type: String, required: true },
  nom: { type: String, required: true },
});
</script>

<style scoped>
.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--color-tan);
  color: var(--color-ink);
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 12.5px;
}
</style>