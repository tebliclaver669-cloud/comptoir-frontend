<!--
  MovementTypePill.vue (atom)
  --------------------------------------------------------------
  Rôle : pastille "Sortie" (rose, flèche vers le haut) / "Entrée"
  (vert, flèche vers le bas) de la colonne TYPE du tableau
  Historique. Séparé de StatusPill : sémantique différente (sens
  d'un mouvement de stock, pas un niveau d'alerte) et style propre
  (texte foncé sur fond pastel, plutôt que texte blanc sur fond vif).

  Props :
    - type : 'entree' | 'sortie'
-->
<template>
  <span class="movement-type-pill" :class="`movement-type-pill--${type}`">
    <span class="movement-type-pill__arrow" aria-hidden="true">{{ type === 'entree' ? '↓' : '↑' }}</span>
    {{ type === 'entree' ? 'Entrée' : 'Sortie' }}
  </span>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (v) => ['entree', 'sortie'].includes(v),
  },
});
</script>

<style scoped>
.movement-type-pill {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
  padding: 6px 22px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text-main);
}

.movement-type-pill--sortie {
  background: var(--color-movement-sortie-bg);
}

.movement-type-pill--entree {
  background: var(--color-movement-entree-bg);
}

.movement-type-pill__arrow {
  font-weight: 800;
  font-size: 0.8rem;
}
</style>
