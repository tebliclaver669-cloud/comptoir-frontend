<!--
  InscriptionVendeurPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/inscription-vendeur". Reçoit le nom de
  l'entreprise en query param (transmis depuis ConnexionPage via le
  bouton "Nouveau vendeur"). Valide le formulaire, vérifie que les
  deux mots de passe correspondent, enregistre le vendeur côté
  backend (POST /api/vendeurs, rattaché à cette entreprise), puis
  redirige vers la connexion vendeur (avec auto-remplissage).
-->
<template>
  <BannerPageTemplate @help-click="afficherAide">
    <p v-if="messageErreur" class="inscription-vendeur-page__erreur">{{ messageErreur }}</p>

    <InscriptionVendeurForm v-model="formulaire" @submit="gererInscription" />
  </BannerPageTemplate>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BannerPageTemplate from '../components/templates/BannerPageTemplate.vue';
import InscriptionVendeurForm from '../components/organisms/InscriptionVendeurForm.vue';
import { post } from '../services/api';

const route = useRoute();
const router = useRouter();

const entreprise = route.query.entreprise?.toString() || "Nom de l'entreprise";

const formulaire = ref({
  nomPrenoms: '',
  email: '',
  telephone: '',
  motDePasse: '',
  confirmationMotDePasse: '',
});

const messageErreur = ref('');

const champsObligatoires = ['nomPrenoms', 'email', 'telephone', 'motDePasse', 'confirmationMotDePasse'];

async function gererInscription() {
  const champManquant = champsObligatoires.find((champ) => !formulaire.value[champ].trim());
  if (champManquant) {
    messageErreur.value = 'Merci de remplir tous les champs.';
    return;
  }

  if (formulaire.value.telephone.length !== 10) {
    messageErreur.value = 'Le numéro de téléphone doit contenir exactement 10 chiffres.';
    return;
  }

  if (formulaire.value.motDePasse !== formulaire.value.confirmationMotDePasse) {
    messageErreur.value = 'Les deux mots de passe ne correspondent pas.';
    return;
  }

  try {
    await post('/vendeurs', {
      nomEntreprise: entreprise,
      nomPrenoms: formulaire.value.nomPrenoms,
      email: formulaire.value.email,
      telephone: formulaire.value.telephone,
      motDePasse: formulaire.value.motDePasse,
    });

    messageErreur.value = '';
    router.push({
      path: '/connexion',
      query: {
        entreprise,
        nom: formulaire.value.nomPrenoms,
        motDePasse: formulaire.value.motDePasse,
      },
    });
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

function afficherAide() {
  window.alert('Aide : renseignez vos informations pour créer votre compte vendeur.');
}
</script>

<style scoped>
.inscription-vendeur-page__erreur {
  color: #b3251d;
  font-style: italic;
  text-align: center;
  margin: 0 0 var(--space-lg);
}
</style>