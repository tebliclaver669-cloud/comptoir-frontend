<!--
  ConnexionPageTemplate.vue (template)
  --------------------------------------------------------------
  Rôle : bandeau de marque + pastille du nom de l'entreprise + un
  bouton "maison" (retour accueil + déconnexion) + zone libre pour
  le formulaire de connexion (slot).
-->
<template>
  <div class="connexion-template">
    <BrandBanner @help-click="$emit('help-click')" />

    <div class="connexion-template__context">
      <span class="connexion-template__pill connexion-template__pill--entreprise">
        {{ nomEntreprise }}
      </span>

      <RetourAccueilButton variante="clair" />
    </div>

    <div class="connexion-template__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import BrandBanner from '../molecules/BrandBanner.vue';
import RetourAccueilButton from '../atoms/RetourAccueilButton.vue';

defineProps({
  nomEntreprise: {
    type: String,
    required: true,
  },
});

defineEmits(['help-click']);
</script>

<style scoped>
.connexion-template {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #16212B;
  font-family: 'IBM Plex Sans', sans-serif;
}

.connexion-template__context {
  background: #EDE7D6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 28px 0;
}

.connexion-template__pill {
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 13.5px;
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid #C9BFA4;
}

.connexion-template__pill--entreprise {
  background: #FBF8F1;
  color: #2B2620;
}

.connexion-template__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #EDE7D6;
  padding: 32px 28px 60px;
}
</style>