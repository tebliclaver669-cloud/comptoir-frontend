<!--
  ConnexionAdminPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/connexion-admin". Formulaire simple
  identifiant + mot de passe, vérifié contre admin.js.
-->
<template>
  <BannerPageTemplate @help-click="afficherAide">
    <div class="connexion-admin-page__form">
      <p v-if="messageErreur" class="connexion-admin-page__erreur">{{ messageErreur }}</p>

      <span class="connexion-admin-page__tag">ADMINISTRATION</span>
      <div class="connexion-admin-page__body">
        <div class="connexion-admin-page__row">
          <label class="connexion-admin-page__label" for="identifiant">IDENTIFIANT</label>
          <input id="identifiant" v-model="identifiant" type="text" class="connexion-admin-page__input">
        </div>
        <div class="connexion-admin-page__row">
          <label class="connexion-admin-page__label" for="motDePasse">MOT DE PASSE</label>
          <input id="motDePasse" v-model="motDePasse" type="password" class="connexion-admin-page__input" @keyup.enter="gererConnexion">
        </div>
        <button type="button" class="connexion-admin-page__submit" @click="gererConnexion">Entrer</button>
      </div>
    </div>
  </BannerPageTemplate>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BannerPageTemplate from '../components/templates/BannerPageTemplate.vue';
import { identifiantsAdminValides } from '../store/admin';

const router = useRouter();

const identifiant = ref('');
const motDePasse = ref('');
const messageErreur = ref('');

function gererConnexion() {
  if (!identifiant.value.trim() || !motDePasse.value.trim()) {
    messageErreur.value = 'Merci de remplir tous les champs.';
    return;
  }

  if (!identifiantsAdminValides(identifiant.value, motDePasse.value)) {
    messageErreur.value = 'Identifiant ou mot de passe incorrect.';
    return;
  }

  messageErreur.value = '';
  router.push('/admin/vue-ensemble');
}

function afficherAide() {
  window.alert('Aide : accès réservé à l\'administrateur de la plateforme.');
}
</script>

<style scoped>
.connexion-admin-page__form {
  max-width: 420px;
  margin: 0 auto;
}

.connexion-admin-page__erreur {
  color: #b3251d;
  font-style: italic;
  text-align: center;
  margin: 0 0 var(--space-lg);
}

.connexion-admin-page__tag {
  display: inline-block;
  background: var(--color-navy);
  color: var(--color-cream);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  padding: 4px 11px;
  border-radius: 2px 2px 0 0;
}

.connexion-admin-page__body {
  border-top: 1px dashed var(--color-border);
  padding-top: 18px;
}

.connexion-admin-page__row {
  margin-bottom: 14px;
}

.connexion-admin-page__label {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #5B5340;
  margin-bottom: 6px;
}

.connexion-admin-page__input {
  width: 100%;
  box-sizing: border-box;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-ink);
}

.connexion-admin-page__submit {
  width: 100%;
  height: 40px;
  margin-top: 6px;
  border: none;
  border-radius: 4px;
  background: var(--color-navy);
  color: var(--color-cream);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
</style>