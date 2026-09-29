<!--
  ConnexionVendeurPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/connexion-vendeur". C'est le lien dédié
  qu'un vendeur utilise pour se connecter directement (par exemple
  transmis par son gérant), plutôt que de passer par la page de
  connexion générale et de basculer manuellement sur "Vendeur".

  BRANCHÉ SUR LE VRAI BACKEND (comme ConnexionPage.vue) :
  gererConnexion() appelle POST /api/auth/connexion, qui détecte
  lui-même le rôle côté serveur. Les anciennes fonctions locales
  (motDePasseValidePourEntreprise, trouverVendeurParMotDePasse) ont
  été retirées de store/vendeurs.js car toute vérification se fait
  maintenant côté serveur (bcrypt) — chaque vendeur a son propre mot
  de passe et doit donc être identifié par son NOM, pas seulement par
  un mot de passe.

  Différences avec ConnexionPage :
    - le rôle démarre sur 'vendeur' plutôt que 'gerant'
    - pas de bouton "S'inscrire en tant que vendeur" (on ne
      propose pas de s'inscrire à quelqu'un qui est déjà en train
      de se connecter en tant que vendeur)
  Le toggle Gérant/Vendeur reste affiché et modifiable : si un
  gérant atterrit par erreur sur ce lien, il peut rebasculer.
-->
<template>
  <ConnexionVendeurTemplate :nom-entreprise="nomEntreprise" @help-click="afficherAide">
    <p v-if="messageErreur" class="connexion-vendeur-page__erreur">{{ messageErreur }}</p>

    <ConnexionForm
      v-model:role="role"
      v-model:nom="nomSaisi"
      v-model:password="motDePasse"
      @submit="gererConnexion"
    />
  </ConnexionVendeurTemplate>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConnexionVendeurTemplate from '../components/templates/ConnexionVendeurTemplate.vue';
import ConnexionForm from '../components/organisms/ConnexionForm.vue';
import { post, enregistrerToken } from '../services/api';
import { ouvrirSession } from '../store/session';
import { chargerProduits } from '../store/produits';

const route = useRoute();
const router = useRouter();

const nomEntreprise = ref(route.query.entreprise?.toString() || "Nom de l'entreprise");

// Différence clé avec ConnexionPage : on démarre sur 'vendeur'.
const role = ref('vendeur');
const nomSaisi = ref('');
const motDePasse = ref('');
const messageErreur = ref('');

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

    // Le backend détecte lui-même le rôle réel (reponse.role) —
    // c'est celui-là qui décide la destination, pas le toggle local.
    router.push(reponse.role === 'vendeur' ? '/tableau-de-bord-vendeur' : '/tableau-de-bord');
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

function afficherAide() {
  window.alert('Aide : entrez votre nom et le mot de passe qui vous a été communiqué par votre gérant pour vous connecter.');
}
</script>

<style scoped>
.connexion-vendeur-page__erreur {
  color: #b3251d;
  font-style: italic;
  text-align: center;
  margin: 0 0 var(--space-lg);
}
</style>