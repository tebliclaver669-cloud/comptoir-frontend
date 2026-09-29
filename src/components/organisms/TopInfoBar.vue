<!--
  TopInfoBar.vue (organism)
  --------------------------------------------------------------
  Rôle : reproduit la ligne sous le bandeau : à gauche la pilule
  "Nom de l'entreprise" (rappel informatif, non cliquable), à
  droite le bouton pilule "S'inscrire en tant que vendeur".

  Règle métier reprise du parcours défini : ce bouton n'est actif
  que lorsque "Vendeur" est sélectionné dans le toggle -> d'où la
  prop `inscriptionVendeurActive`, calculée par la page à partir du
  rôle sélectionné.

  Props :
    - nomEntreprise : texte affiché dans la pilule de gauche
    - inscriptionVendeurActive : active/désactive le bouton de droite
  Emits :
    - inscription-vendeur-click
-->
<template>
  <div class="top-info-bar">
    <PillBadge :text="nomEntreprise" />
    <AppButton
      label="S'inscrire en tant que vendeur"
      :disabled="!inscriptionVendeurActive"
      @click="$emit('inscription-vendeur-click')"
    />
  </div>
</template>

<script setup>
import PillBadge from '../atoms/PillBadge.vue';
import AppButton from '../atoms/AppButton.vue';

defineProps({
  nomEntreprise: { type: String, required: true },
  inscriptionVendeurActive: { type: Boolean, default: false },
});
defineEmits(['inscription-vendeur-click']);
</script>

<style scoped>
.top-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  flex-wrap: wrap;
  gap: var(--space-md);
}

/* Le bouton pilule de droite reprend le style d'AppButton mais en
   plus grand et arrondi façon pilule, comme sur la maquette. */
.top-info-bar :deep(.app-button) {
  border-radius: 999px;
  padding: var(--space-md) var(--space-xl);
  font-weight: 700;
}
</style>
