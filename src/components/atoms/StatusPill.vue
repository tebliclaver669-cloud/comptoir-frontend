<!--
  StatusPill.vue (atom)
  --------------------------------------------------------------
  Rôle : petit badge coloré affichant le statut de stock d'un
  produit dans le catalogue.

  Props :
    - statut : 'correct' | 'bas-du-seuil' | 'rupture' | 'approvisionne'
    - label  : texte affiché ("Stock correct", "Bas du seuil", "Rupture",
               "Approvisioné")
  On reçoit le statut déjà calculé (et pas le stock brut) : cet
  atom ne fait aucun calcul, il affiche seulement ce qu'on lui donne.
-->
<template>
  <span class="status-pill" :class="`status-pill--${statut}`">
    <span class="status-pill__dot" />{{ label }}
  </span>
</template>

<script setup>
defineProps({
  statut: {
    type: String,
    required: true,
    validator: (v) => ['correct', 'bas-du-seuil', 'rupture', 'approvisionne'].includes(v),
  },
  label: { type: String, required: true },
});
</script>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.status-pill__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-pill--correct {
  background: var(--color-pill-ok-bg);
  color: var(--color-pill-ok-text);
}

.status-pill--bas-du-seuil {
  background: var(--color-pill-warning-bg);
  color: var(--color-pill-warning-text);
}

.status-pill--rupture {
  background: var(--color-pill-critical-bg);
  color: var(--color-pill-critical-text);
}

.status-pill--approvisionne {
  background: var(--color-bg-panel-muted);
  color: var(--color-text-main);
}
</style>