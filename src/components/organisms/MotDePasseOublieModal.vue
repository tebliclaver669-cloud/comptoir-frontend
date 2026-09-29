<!--
  MotDePasseOublieModal.vue (organism)
  --------------------------------------------------------------
  Rôle : fenêtre "Mot de passe oublié ?" ouverte depuis la page de
  connexion gérant/vendeur (/connexion). Comme l'application n'a pas
  de vrai serveur d'email, l'identité est vérifiée en local avec le
  NOM + L'EMAIL enregistrés à l'inscription (au lieu du mot de passe,
  justement oublié) : si ça correspond au gérant de l'entreprise ou
  à un vendeur inscrit pour cette entreprise, la personne peut alors
  définir directement un nouveau mot de passe.

  Si le compte trouvé est un vendeur qui avait déjà personnalisé son
  mot de passe, cette réinitialisation reste possible (c'est bien lui
  qui la demande, via son propre nom + email) et le flag
  motDePassePersonnalise reste à true ensuite.

  Props :
    - nomEntreprise : entreprise dans le contexte de la page de
      connexion, utilisée pour cibler la bonne entreprise/les bons
      vendeurs
  Emits :
    - reussite({ nom }) : mot de passe réinitialisé avec succès,
      pour que la page de connexion puisse pré-remplir le nom
    - fermer
-->
<template>
  <div class="mdp-oublie-modal__overlay" @click.self="$emit('fermer')">
    <div class="mdp-oublie-modal">
      <div class="mdp-oublie-modal__header">
        <p class="mdp-oublie-modal__titre">Mot de passe oublié</p>
        <button type="button" class="mdp-oublie-modal__fermer" aria-label="Fermer" @click="$emit('fermer')">✕</button>
      </div>

      <!-- Étape 1 : identification par nom + email -->
      <template v-if="etape === 'identification'">
        <p class="mdp-oublie-modal__aide">
          Saisissez votre nom et l'adresse email renseignée lors de votre inscription pour {{ nomEntreprise }}.
        </p>

        <p v-if="messageErreur" class="mdp-oublie-modal__erreur">{{ messageErreur }}</p>

        <form class="mdp-oublie-modal__form" @submit.prevent="verifierIdentite">
          <input
            v-model="nom"
            type="text"
            class="mdp-oublie-modal__input"
            placeholder="Votre nom"
            autofocus
          >
          <input
            v-model="email"
            type="email"
            class="mdp-oublie-modal__input"
            placeholder="Votre email"
          >
          <button type="submit" class="mdp-oublie-modal__submit">Vérifier</button>
        </form>
      </template>

      <!-- Étape 2 : nouveau mot de passe -->
      <template v-else-if="etape === 'nouveauMotDePasse'">
        <p class="mdp-oublie-modal__aide">
          Identité confirmée. Choisissez un nouveau mot de passe pour {{ nom }}.
        </p>

        <p v-if="messageErreur" class="mdp-oublie-modal__erreur">{{ messageErreur }}</p>

        <form class="mdp-oublie-modal__form" @submit.prevent="reinitialiser">
          <div class="mdp-oublie-modal__password-wrap">
            <input
              v-model="nouveauMotDePasse"
              :type="isNouveauVisible ? 'text' : 'password'"
              class="mdp-oublie-modal__input mdp-oublie-modal__input--password"
              placeholder="Nouveau mot de passe"
              autofocus
            >
            <button
              type="button"
              class="mdp-oublie-modal__toggle-password"
              :aria-label="isNouveauVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              @click="isNouveauVisible = !isNouveauVisible"
            >
              <svg v-if="isNouveauVisible" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.9 18.9 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>

          <div class="mdp-oublie-modal__password-wrap">
            <input
              v-model="confirmationMotDePasse"
              :type="isConfirmationVisible ? 'text' : 'password'"
              class="mdp-oublie-modal__input mdp-oublie-modal__input--password"
              placeholder="Confirmer le mot de passe"
            >
            <button
              type="button"
              class="mdp-oublie-modal__toggle-password"
              :aria-label="isConfirmationVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              @click="isConfirmationVisible = !isConfirmationVisible"
            >
              <svg v-if="isConfirmationVisible" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.9 18.9 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>

          <button type="submit" class="mdp-oublie-modal__submit">Réinitialiser le mot de passe</button>
        </form>
      </template>

      <!-- Étape 3 : succès -->
      <template v-else>
        <p class="mdp-oublie-modal__succes">
          Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <button type="button" class="mdp-oublie-modal__submit" @click="terminer">
          Se connecter
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { gerantParEmail, mettreAJourEntreprise } from '../../store/entreprises';
import { vendeurParEmail, mettreAJourVendeur } from '../../store/vendeurs';

const props = defineProps({
  nomEntreprise: { type: String, required: true },
});

const emit = defineEmits(['reussite', 'fermer']);

const etape = ref('identification');
const messageErreur = ref('');

const nom = ref('');
const email = ref('');
const roleTrouve = ref(null);

const nouveauMotDePasse = ref('');
const confirmationMotDePasse = ref('');
const isNouveauVisible = ref(false);
const isConfirmationVisible = ref(false);

function verifierIdentite() {
  if (!nom.value.trim() || !email.value.trim()) {
    messageErreur.value = 'Merci de remplir tous les champs.';
    return;
  }

  if (gerantParEmail(props.nomEntreprise, nom.value, email.value)) {
    roleTrouve.value = 'gerant';
    messageErreur.value = '';
    etape.value = 'nouveauMotDePasse';
    return;
  }

  if (vendeurParEmail(props.nomEntreprise, nom.value, email.value)) {
    roleTrouve.value = 'vendeur';
    messageErreur.value = '';
    etape.value = 'nouveauMotDePasse';
    return;
  }

  messageErreur.value = "Aucun compte ne correspond à ce nom et cet email pour cette entreprise.";
}

function reinitialiser() {
  if (!nouveauMotDePasse.value.trim() || !confirmationMotDePasse.value.trim()) {
    messageErreur.value = 'Merci de remplir tous les champs.';
    return;
  }

  if (nouveauMotDePasse.value !== confirmationMotDePasse.value) {
    messageErreur.value = 'Les deux mots de passe ne correspondent pas.';
    return;
  }

  if (roleTrouve.value === 'gerant') {
    mettreAJourEntreprise(props.nomEntreprise, { motDePasse: nouveauMotDePasse.value });
  } else {
    mettreAJourVendeur(props.nomEntreprise, nom.value, {
      motDePasse: nouveauMotDePasse.value,
      motDePassePersonnalise: true,
    });
  }

  messageErreur.value = '';
  etape.value = 'succes';
}

function terminer() {
  emit('reussite', { nom: nom.value });
}
</script>

<style scoped>
.mdp-oublie-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.mdp-oublie-modal {
  background: var(--color-bg-card, #FBF8F1);
  border-radius: var(--radius-lg, 10px);
  padding: var(--space-lg, 20px) var(--space-xl, 26px);
  width: 360px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.mdp-oublie-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm, 8px);
}

.mdp-oublie-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-ink, #2B2620);
  margin: 0;
}

.mdp-oublie-modal__fermer {
  border: none;
  background: transparent;
  color: var(--color-ink-muted, #5B5340);
  font-size: 14px;
  cursor: pointer;
}

.mdp-oublie-modal__aide {
  font-size: 12px;
  color: var(--color-ink-muted, #5B5340);
  margin: 0 0 var(--space-md, 14px);
}

.mdp-oublie-modal__erreur {
  color: #b3251d;
  font-style: italic;
  margin: 0 0 var(--space-md, 14px);
  font-size: 13px;
}

.mdp-oublie-modal__succes {
  font-size: 13px;
  color: var(--color-ink, #2B2620);
  margin: 0 0 var(--space-md, 14px);
}

.mdp-oublie-modal__form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mdp-oublie-modal__input {
  width: 100%;
  box-sizing: border-box;
  height: 38px;
  border: 1px solid var(--color-border, #C9BFA4);
  border-radius: 4px;
  background: var(--color-cream-light, #FBF8F1);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-ink, #2B2620);
}

.mdp-oublie-modal__password-wrap {
  position: relative;
}

.mdp-oublie-modal__input--password {
  padding-right: 42px;
}

.mdp-oublie-modal__toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mdp-oublie-modal__submit {
  height: 38px;
  border: none;
  border-radius: 4px;
  background: var(--color-tan, #A9825C);
  color: var(--color-ink, #2B2620);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  margin-top: 4px;
}
</style>
