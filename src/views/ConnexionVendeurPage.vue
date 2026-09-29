<!--
  ConnexionVendeurPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/connexion-vendeur". C'est le lien dédié
  qu'un vendeur utilise pour se connecter directement (par exemple
  transmis par son gérant), plutôt que de passer par la page de
  connexion générale et de basculer manuellement sur "Vendeur".

  Différences avec ConnexionPage (page de connexion générale) :
    - le rôle démarre sur 'vendeur' plutôt que 'gerant'
    - pas de bouton "S'inscrire en tant que vendeur" (on ne
      propose pas de s'inscrire à quelqu'un qui est déjà en train
      de se connecter en tant que vendeur)
  Le toggle Gérant/Vendeur reste affiché et modifiable : si un
  gérant atterrit par erreur sur ce lien, il peut rebasculer.

  Réutilise ConnexionForm tel quel (titre + toggle + mot de passe) :
  aucune nouvelle logique de formulaire n'est nécessaire ici.
-->
<template>
  <ConnexionVendeurTemplate :nom-entreprise="nomEntreprise" @help-click="afficherAide">
    <p v-if="messageErreur" class="connexion-vendeur-page__erreur">{{ messageErreur }}</p>

    <ConnexionForm v-model:role="role" v-model:password="motDePasse" @submit="gererConnexion" />
  </ConnexionVendeurTemplate>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConnexionVendeurTemplate from '../components/templates/ConnexionVendeurTemplate.vue';
import ConnexionForm from '../components/organisms/ConnexionForm.vue';
import { trouverEntreprise, motDePasseValide as motDePasseValideEntreprise } from '../store/entreprises';
import { motDePasseValidePourEntreprise, trouverVendeurParMotDePasse } from '../store/vendeurs';
import { ouvrirSession } from '../store/session';

const route = useRoute();
const router = useRouter();

const nomEntreprise = ref(route.query.entreprise?.toString() || "Nom de l'entreprise");

// Différence clé avec ConnexionPage : on démarre sur 'vendeur'.
const role = ref('vendeur');
const motDePasse = ref('');
const messageErreur = ref('');

function gererConnexion() {
  if (!motDePasse.value.trim()) {
    messageErreur.value = 'Merci de saisir le mot de passe.';
    return;
  }

  const estValide =
    role.value === 'gerant'
      ? motDePasseValideEntreprise(nomEntreprise.value, motDePasse.value)
      : motDePasseValidePourEntreprise(nomEntreprise.value, motDePasse.value);

  if (!estValide) {
    messageErreur.value = role.value === 'gerant'
      ? "Nom de l'entreprise ou mot de passe incorrect."
      : 'Mot de passe incorrect.';
    return;
  }
   if (role.value === 'gerant') {
    const entreprise = trouverEntreprise(nomEntreprise.value);
    ouvrirSession('gerant', nomEntreprise.value, entreprise.nomGerant);
  } else {
    const vendeur = trouverVendeurParMotDePasse(nomEntreprise.value, motDePasse.value);
    ouvrirSession('vendeur', nomEntreprise.value, vendeur ? vendeur.nomPrenoms : 'Vendeur');
  }
  // TODO : remplacer par un vrai appel API une fois le backend prêt :
  // await fetch('/api/connexion', { method: 'POST', body: JSON.stringify({ entreprise: nomEntreprise.value, role: role.value, motDePasse: motDePasse.value }) })
  messageErreur.value = '';
  router.push(role.value === 'vendeur' ? '/tableau-de-bord-vendeur' : '/tableau-de-bord');
}

function afficherAide() {
  window.alert('Aide : entrez le mot de passe qui vous a été communiqué par votre gérant pour vous connecter.');
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
