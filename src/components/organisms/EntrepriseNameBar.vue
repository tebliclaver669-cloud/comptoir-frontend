<!--
  EntrepriseNameBar.vue (organism)
  --------------------------------------------------------------
  Rôle : reproduit la ligne sous le bandeau de la page de connexion
  VENDEUR : uniquement la pilule "Nom de l'entreprise", sans le
  bouton "S'inscrire en tant que vendeur" présent sur la page de
  connexion générale (TopInfoBar). Séparé de TopInfoBar plutôt que
  de lui ajouter une prop "masquerInscription" : les deux
  variantes ont un sens métier différent (page d'entrée générale
  vs lien de connexion dédié aux vendeurs) et risquent d'évoluer
  différemment.

  Props :
    - nomEntreprise : texte affiché dans la pilule
-->
<template>
  <div class="entreprise-name-bar">
    <PillBadge :text="nomEntreprise" />
  </div>
</template>

<script setup>
import PillBadge from '../atoms/PillBadge.vue';

defineProps({
  nomEntreprise: { type: String, required: true },
});
</script>

<style scoped>
.entreprise-name-bar {
  padding: var(--space-lg) var(--space-xl);
}
</style>
