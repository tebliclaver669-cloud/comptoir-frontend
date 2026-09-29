<!--
  ConfirmationEmailPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/confirmation-email". Affichée juste
  après l'inscription d'une entreprise, avant tout accès au
  tableau de bord. L'utilisateur saisit le code à 6 chiffres reçu
  par email (POST /api/entreprises/:nomEntreprise/confirmer). Une
  fois confirmé, redirection vers Connexion avec nom + mot de passe
  déjà remplis pour connecter automatiquement.
-->
<template>
  <BannerPageTemplate @help-click="afficherAide">
    <div class="confirmation-email__contenu">
      <p class="confirmation-email__texte">
        Un code de confirmation a été envoyé à l'adresse email de "{{ nomEntreprise }}".
        Saisissez-le ci-dessous pour activer votre compte.
      </p>

      <p v-if="messageErreur" class="confirmation-email__erreur">{{ messageErreur }}</p>
      <p v-if="messageSucces" class="confirmation-email__succes">{{ messageSucces }}</p>

      <div class="confirmation-email__row">
        <label class="confirmation-email__label" for="code">CODE DE CONFIRMATION</label>
        <input
          id="code"
          v-model="code"
          type="text"
          inputmode="numeric"
          maxlength="6"
          placeholder="123456"
          class="confirmation-email__input"
          @keyup.enter="gererConfirmation"
        >
      </div>

      <button type="button" class="confirmation-email__submit" @click="gererConfirmation">
        Confirmer
      </button>
    </div>
  </BannerPageTemplate>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BannerPageTemplate from '../components/templates/BannerPageTemplate.vue';
import { post } from '../services/api';

const route = useRoute();
const router = useRouter();

const nomEntreprise = route.query.entreprise?.toString() || '';
const nomGerant = route.query.nom?.toString() || '';
const motDePasse = route.query.motDePasse?.toString() || '';

const code = ref('');
const messageErreur = ref('');
const messageSucces = ref('');

async function gererConfirmation() {
  if (!code.value.trim()) {
    messageErreur.value = 'Merci de saisir le code reçu par email.';
    return;
  }

  try {
    await post(`/entreprises/${encodeURIComponent(nomEntreprise)}/confirmer`, { code: code.value.trim() });

    messageErreur.value = '';
    messageSucces.value = 'Email confirmé ! Connexion en cours...';

    router.push({
      path: '/connexion',
      query: { entreprise: nomEntreprise, nom: nomGerant, motDePasse },
    });
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

function afficherAide() {
  window.alert("Aide : le code de confirmation a été envoyé par email à l'adresse renseignée à l'inscription.");
}
</script>

<style scoped>
.confirmation-email__contenu {
  max-width: 380px;
  margin: 0 auto;
  text-align: center;
}

.confirmation-email__texte {
  font-size: 13px;
  color: var(--color-ink-muted);
  line-height: 1.5;
  margin: 0 0 var(--space-lg);
}

.confirmation-email__erreur {
  color: #b3251d;
  font-style: italic;
  margin: 0 0 var(--space-md);
}

.confirmation-email__succes {
  color: var(--color-green);
  font-style: italic;
  margin: 0 0 var(--space-md);
}

.confirmation-email__row {
  margin-bottom: var(--space-md);
}

.confirmation-email__label {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  margin-bottom: 6px;
}

.confirmation-email__input {
  width: 100%;
  box-sizing: border-box;
  height: 42px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  text-align: center;
  letter-spacing: 0.3em;
  font-weight: 600;
  font-size: 18px;
  color: var(--color-ink);
}

.confirmation-email__submit {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 4px;
  background: var(--color-green);
  color: var(--color-text-on-dark);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
</style>