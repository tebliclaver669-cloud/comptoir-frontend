<!--
  BannerPageTemplate.vue (template)
  --------------------------------------------------------------
  Rôle : habillage minimal pour les pages publiques qui n'ont
  besoin que du bandeau de marque au-dessus d'un formulaire libre
  (ex. Inscription entreprise). Contrairement à PublicPageTemplate,
  il ne porte pas la bande "Connexion / Créer un compte".
-->
<template>
  <div class="banner-template">
    <BrandBanner @help-click="$emit('help-click')" />
    <div class="banner-template__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import BrandBanner from '../molecules/BrandBanner.vue';

defineEmits(['help-click']);
</script>

<style scoped>
.banner-template {
  background: #16212B;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'IBM Plex Sans', sans-serif;
}

.banner-template__body {
  background: #EDE7D6;
  border-top: 1px solid #DAD2B8;
  padding: 28px;
}
</style>