<!--
  ConnexionPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/connexion". BRANCHÉ SUR LE VRAI BACKEND :
  gererConnexion() appelle POST /api/auth/connexion, qui détecte
  lui-même le rôle (gérant ou vendeur) côté serveur. En cas de
  succès, le token reçu est stocké (api.js), la session frontend est
  ouverte avec les vraies infos renvoyées, PUIS un écran de
  transition (le "C" qui se remplit) s'affiche brièvement avant de
  basculer vers le tableau de bord — au lieu d'un changement de page
  brutal.
-->
<template>
  <div class="connexion-page__wrapper">
    <ConnexionPageTemplate
      :nom-entreprise="nomEntreprise"
      @help-click="afficherAide"
    >
      <p v-if="messageErreur" class="connexion-page__erreur">{{ messageErreur }}</p>

      <ConnexionForm
        v-model:nom="nomSaisi"
        v-model:password="motDePasse"
        @submit="gererConnexion"
      />
    </ConnexionPageTemplate>

    <ConnexionTransition v-if="enTransition" @termine="allerAuTableauDeBord" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConnexionPageTemplate from '../components/templates/ConnexionPageTemplate.vue';
import ConnexionForm from '../components/organisms/ConnexionForm.vue';
import ConnexionTransition from '../components/organisms/ConnexionTransition.vue';
import { post, enregistrerToken } from '../services/api';
import { ouvrirSession } from '../store/session';
import { chargerProduits } from '../store/produits';

const route = useRoute();
const router = useRouter();

const nomEntreprise = ref(route.query.entreprise?.toString() || "Nom de l'entreprise");

const nomSaisi = ref(route.query.nom?.toString() || '');
const motDePasse = ref(route.query.motDePasse?.toString() || '');
const messageErreur = ref('');

const enTransition = ref(false);
const destination = ref('');

async function gererConnexion() {
  if (!nomSaisi.value.trim() || !motDePasse.value.trim()) {
    messageErreur.value = 'Merci de remplir tous les champs.';
    return;
  }

  try {
    const reponse = await post('/auth/connexion', {
      nomEntreprise: nomEntreprise.value,
      nom: nomSaisi.value,
      motDePasse: motDePasse.value,
    });

    enregistrerToken(reponse.token);
    ouvrirSession(reponse.role, reponse.nomEntreprise, reponse.nom);
    await chargerProduits(reponse.nomEntreprise);
    messageErreur.value = '';

    // Connexion réussie -> écran de transition, la navigation
    // réelle n'a lieu qu'une fois l'animation terminée (voir
    // allerAuTableauDeBord, déclenché par @termine).
    destination.value = reponse.role === 'gerant' ? '/tableau-de-bord' : '/tableau-de-bord-vendeur';
    enTransition.value = true;
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

function allerAuTableauDeBord() {
  router.push(destination.value);
}

onMounted(() => {
  if (route.query.nom && route.query.motDePasse) {
    gererConnexion();
  }
});

function afficherAide() {
  window.alert('Aide : entrez votre nom et votre mot de passe pour vous connecter.');
}
</script>

<style scoped>
.connexion-page__wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #EDE7D6;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><text x='10' y='55' font-family='Fraunces,serif' font-style='italic' font-weight='600' font-size='44' fill='%23A9825C' opacity='0.07'>C</text><text x='70' y='115' font-family='Fraunces,serif' font-style='italic' font-weight='600' font-size='44' fill='%23A9825C' opacity='0.07'>C</text></svg>");
}

.connexion-page__erreur {
  color: #b3251d;
  font-style: italic;
  text-align: center;
  margin: 0 0 var(--space-lg);
}
</style>