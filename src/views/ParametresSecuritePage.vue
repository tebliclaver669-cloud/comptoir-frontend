<!--
  ParametresSecuritePage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/parametres/securite". Permet au gérant
  de changer son mot de passe. Le message d'erreur/succès est
  DANS le même bloc centré que le formulaire (pas à côté), pour
  qu'il reste bien aligné avec lui plutôt que collé à gauche.
-->
<template>
  <GerantPageTemplate role="gerant">
    <header class="parametres-page__header">
      <h1 class="parametres-page__title">Paramètres</h1>
      <p class="parametres-page__subtitle">Gérez votre entreprise, votre sécurité et vos vendeurs</p>
    </header>

    <ParametresTabs />

    <div class="parametres-page__body">
      <div class="securite-form">
        <span class="securite-form__tag">SÉCURITÉ</span>

        <div class="securite-form__body">
          <p v-if="messageErreur" class="parametres-page__erreur">{{ messageErreur }}</p>
          <p v-if="messageSucces" class="parametres-page__succes">{{ messageSucces }}</p>

          <div class="securite-form__row">
            <label class="securite-form__label" for="motDePasseActuel">MOT DE PASSE ACTUEL</label>
            <input id="motDePasseActuel" type="password" class="securite-form__input" v-model="motDePasseActuel">
          </div>

          <div class="securite-form__row">
            <label class="securite-form__label" for="nouveauMotDePasse">NOUVEAU MOT DE PASSE</label>
            <input id="nouveauMotDePasse" type="password" class="securite-form__input" v-model="nouveauMotDePasse">
          </div>

          <div class="securite-form__row">
            <label class="securite-form__label" for="confirmation">CONFIRMER LE NOUVEAU MOT DE PASSE</label>
            <input id="confirmation" type="password" class="securite-form__input" v-model="confirmation">
          </div>

          <div class="securite-form__actions">
            <button type="button" class="securite-form__submit" @click="gererChangement">Changer le mot de passe</button>
          </div>
        </div>
      </div>
    </div>
  </GerantPageTemplate>
</template>

<script setup>
import { ref } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import ParametresTabs from '../components/molecules/ParametresTabs.vue';
import { motDePasseValide, mettreAJourEntreprise } from '../store/entreprises';
import { useSession } from '../store/session';

const session = useSession();

const motDePasseActuel = ref('');
const nouveauMotDePasse = ref('');
const confirmation = ref('');
const messageErreur = ref('');
const messageSucces = ref('');

function gererChangement() {
  messageSucces.value = '';

  if (!motDePasseActuel.value.trim() || !nouveauMotDePasse.value.trim() || !confirmation.value.trim()) {
    messageErreur.value = 'Merci de remplir tous les champs.';
    return;
  }

  if (!motDePasseValide(session.nomEntreprise.value, motDePasseActuel.value)) {
    messageErreur.value = 'Le mot de passe actuel est incorrect.';
    return;
  }

  if (nouveauMotDePasse.value !== confirmation.value) {
    messageErreur.value = 'Les deux nouveaux mots de passe ne correspondent pas.';
    return;
  }

  mettreAJourEntreprise(session.nomEntreprise.value, { motDePasse: nouveauMotDePasse.value });

  messageErreur.value = '';
  messageSucces.value = 'Mot de passe mis à jour.';
  motDePasseActuel.value = '';
  nouveauMotDePasse.value = '';
  confirmation.value = '';
}
</script>

<style scoped>
.parametres-page__header {
  padding: var(--space-lg) var(--space-xl) 0;
}

.parametres-page__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.parametres-page__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 var(--space-lg);
}

.parametres-page__body {
  flex: 1;
  padding: var(--space-xl);
  display: flex;
  justify-content: center;
  align-items: center;
}

.parametres-page__erreur {
  color: #b3251d;
  font-style: italic;
  margin: 0 0 var(--space-md);
}

.parametres-page__succes {
  color: var(--color-green);
  font-style: italic;
  margin: 0 0 var(--space-md);
}

.securite-form { max-width: 420px; width: 100%; }

.securite-form__tag {
  display: inline-block;
  background: var(--color-burgundy);
  color: #F1DAD5;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  padding: 4px 11px;
  border-radius: 2px 2px 0 0;
}

.securite-form__body {
  border-top: 1px dashed var(--color-border);
  padding-top: 18px;
}

.securite-form__row { margin-bottom: 14px; }

.securite-form__label {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #5B5340;
  margin-bottom: 6px;
}

.securite-form__input {
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

.securite-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.securite-form__submit {
  height: 32px;
  padding: 0 16px;
  border: none;
  border-radius: 4px;
  background: var(--color-burgundy);
  color: #F1DAD5;
  font-weight: 600;
  font-size: 12.5px;
  cursor: pointer;
}
</style>