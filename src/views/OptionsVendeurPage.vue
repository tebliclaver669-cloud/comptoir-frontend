<!--
  OptionsVendeurPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/options-vendeur", accessible via le
  bouton "Options" de la sidebar vendeur. Permet au vendeur connecté
  de modifier lui-même son nom & prénoms, son email et son
  téléphone (champ par champ, validé par SON PROPRE mot de passe
  actuel — pas celui du gérant), ainsi que son mot de passe.

  Contrairement aux pages Paramètres du gérant, il n'y a qu'un seul
  profil concerné (le sien) : pas de sélection de vendeur.

  BRANCHÉ SUR LE VRAI BACKEND : la vérification du mot de passe se
  fait maintenant sur le serveur (route PUT /api/vendeurs/moi), plus
  côté client — l'ancienne fonction vendeurValide() a été retirée.
-->
<template>
  <GerantPageTemplate role="vendeur">
    <header class="options-vendeur__header">
      <h1 class="options-vendeur__title">Options</h1>
      <p class="options-vendeur__subtitle">Modifiez vos informations et votre mot de passe</p>
    </header>

    <div class="options-vendeur__body">
      <div class="options-vendeur__contenu">
        <p v-if="messageErreurProfil" class="options-vendeur__erreur">{{ messageErreurProfil }}</p>
        <p v-if="messageSuccesProfil" class="options-vendeur__succes">{{ messageSuccesProfil }}</p>

        <ParametresVendeurForm
          v-if="valeursVendeur"
          :valeurs="valeursVendeur"
          @enregistrer="gererEnregistrementProfil"
        />

        <div class="securite-form">
          <span class="securite-form__tag">SÉCURITÉ</span>

          <div class="securite-form__body">
            <p v-if="messageErreurSecurite" class="options-vendeur__erreur">{{ messageErreurSecurite }}</p>
            <p v-if="messageSuccesSecurite" class="options-vendeur__succes">{{ messageSuccesSecurite }}</p>

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
              <button type="button" class="securite-form__submit" @click="gererChangementMotDePasse">
                Changer le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </GerantPageTemplate>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import ParametresVendeurForm from '../components/organisms/ParametresVendeurForm.vue';
import { listerVendeursParEntreprise, mettreAJourMonProfil } from '../store/vendeurs';
import { useSession, ouvrirSession } from '../store/session';

const session = useSession();

const vendeurCourant = ref(null);

async function chargerVendeurConnecte() {
  try {
    const vendeurs = await listerVendeursParEntreprise(session.nomEntreprise.value);
    vendeurCourant.value = vendeurs.find((v) => v.nomPrenoms === session.nomUtilisateur.value) || null;
  } catch (erreur) {
    messageErreurProfil.value = erreur.message;
  }
}

onMounted(chargerVendeurConnecte);

const valeursVendeur = computed(() =>
  vendeurCourant.value
    ? {
        nomPrenoms: vendeurCourant.value.nomPrenoms,
        email: vendeurCourant.value.email,
        telephone: vendeurCourant.value.telephone,
      }
    : null
);

// --- Mes informations (nom, email, téléphone) ---

const messageErreurProfil = ref('');
const messageSuccesProfil = ref('');

async function gererEnregistrementProfil({ champsModifies, motDePasse }) {
  messageSuccesProfil.value = '';
  messageErreurProfil.value = '';

  if (Object.keys(champsModifies).length === 0) {
    messageErreurProfil.value = 'Aucune modification à enregistrer.';
    return;
  }

  if (!motDePasse.trim()) {
    messageErreurProfil.value = 'Merci de saisir votre mot de passe pour valider.';
    return;
  }

  if (champsModifies.email && !champsModifies.email.includes('@')) {
    messageErreurProfil.value = "L'adresse email doit contenir un @.";
    return;
  }

  try {
    const vendeurMisAJour = await mettreAJourMonProfil({
      ...champsModifies,
      motDePasseActuel: motDePasse,
    });

    ouvrirSession('vendeur', session.nomEntreprise.value, vendeurMisAJour.nomPrenoms);
    vendeurCourant.value = vendeurMisAJour;
    messageSuccesProfil.value = 'Modifications enregistrées.';
  } catch (erreur) {
    messageErreurProfil.value = erreur.message;
  }
}

// --- Sécurité (changement de mot de passe) ---

const motDePasseActuel = ref('');
const nouveauMotDePasse = ref('');
const confirmation = ref('');
const messageErreurSecurite = ref('');
const messageSuccesSecurite = ref('');

async function gererChangementMotDePasse() {
  messageSuccesSecurite.value = '';
  messageErreurSecurite.value = '';

  if (!motDePasseActuel.value.trim() || !nouveauMotDePasse.value.trim() || !confirmation.value.trim()) {
    messageErreurSecurite.value = 'Merci de remplir tous les champs.';
    return;
  }

  if (nouveauMotDePasse.value !== confirmation.value) {
    messageErreurSecurite.value = 'Les deux nouveaux mots de passe ne correspondent pas.';
    return;
  }

  try {
    // motDePassePersonnalise passe à true côté serveur : à partir de
    // maintenant, le gérant ne pourra plus réinitialiser ce mot de
    // passe ni s'en servir pour "Connecter un vendeur" — seul le
    // vendeur y a accès.
    await mettreAJourMonProfil({
      motDePasseActuel: motDePasseActuel.value,
      nouveauMotDePasse: nouveauMotDePasse.value,
    });

    messageSuccesSecurite.value = 'Mot de passe mis à jour.';
    motDePasseActuel.value = '';
    nouveauMotDePasse.value = '';
    confirmation.value = '';
  } catch (erreur) {
    messageErreurSecurite.value = erreur.message;
  }
}
</script>

<style scoped>
.options-vendeur__header {
  padding: var(--space-lg) var(--space-xl) 0;
}

.options-vendeur__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.options-vendeur__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 var(--space-lg);
}

.options-vendeur__body {
  flex: 1;
  padding: var(--space-xl);
  display: flex;
  justify-content: center;
}

.options-vendeur__contenu {
  max-width: 460px;
  width: 100%;
}

.options-vendeur__erreur {
  color: #b3251d;
  font-style: italic;
  margin: 0 0 var(--space-md);
}

.options-vendeur__succes {
  color: var(--color-green);
  font-style: italic;
  margin: 0 0 var(--space-md);
}

.securite-form {
  margin-top: var(--space-xl);
}

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