<!--
  InscriptionEntreprisePage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/inscription". Branché sur le vrai
  backend : gererInscription() appelle POST /api/entreprises, qui
  crée l'entreprise dans PostgreSQL et envoie un code de
  confirmation par email. Après inscription réussie, redirection
  vers /confirmation-email (PAS vers Connexion ni le tableau de
  bord) — le compte n'est utilisable qu'une fois le code confirmé,
  le backend refusant toute connexion tant que emailConfirme est
  false.
-->
<template>
  <BannerPageTemplate @help-click="afficherAide">
    <p v-if="messageErreur" class="inscription-page__erreur">{{ messageErreur }}</p>
    <p v-if="chargement" class="inscription-page__info">Création en cours...</p>

    <InscriptionEntrepriseForm v-model="formulaire" @submit="gererInscription" />
  </BannerPageTemplate>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BannerPageTemplate from '../components/templates/BannerPageTemplate.vue';
import InscriptionEntrepriseForm from '../components/organisms/InscriptionEntrepriseForm.vue';
import { post } from '../services/api';

const route = useRoute();
const router = useRouter();

const formulaire = ref({
  nomEntreprise: route.query.entreprise?.toString() || '',
  email: '',
  secteurActivite: '',
  numeroEntreprise: '',
  nomGerant: '',
  motDePasse: '',
});

const messageErreur = ref('');
const chargement = ref(false);

const champsObligatoires = [
  'nomEntreprise',
  'email',
  'secteurActivite',
  'numeroEntreprise',
  'nomGerant',
  'motDePasse',
];

async function gererInscription() {
  const champManquant = champsObligatoires.find((champ) => !formulaire.value[champ].trim());
  if (champManquant) {
    messageErreur.value = 'Merci de remplir tous les champs.';
    return;
  }

  if (!formulaire.value.email.includes('@')) {
    messageErreur.value = "L'adresse email doit contenir un @.";
    return;
  }

  chargement.value = true;
  messageErreur.value = '';

  try {
    await post('/entreprises', {
      nomEntreprise: formulaire.value.nomEntreprise,
      email: formulaire.value.email,
      secteurActivite: formulaire.value.secteurActivite,
      numeroEntreprise: formulaire.value.numeroEntreprise,
      nomGerant: formulaire.value.nomGerant,
      motDePasse: formulaire.value.motDePasse,
    });

    router.push({
      path: '/confirmation-email',
      query: {
        entreprise: formulaire.value.nomEntreprise,
        nom: formulaire.value.nomGerant,
        motDePasse: formulaire.value.motDePasse,
      },
    });
  } catch (erreur) {
    messageErreur.value = erreur.message;
  } finally {
    chargement.value = false;
  }
}

function afficherAide() {
  window.alert('Aide : renseignez les informations de votre entreprise pour créer votre compte gérant.');
}
</script>

<style scoped>
.inscription-page__erreur {
  color: #b3251d;
  font-style: italic;
  text-align: center;
  margin: 0 0 var(--space-lg);
}

.inscription-page__info {
  color: var(--color-ink-muted);
  font-style: italic;
  text-align: center;
  margin: 0 0 var(--space-lg);
}
</style>