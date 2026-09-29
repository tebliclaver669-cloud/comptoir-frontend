<!--
  ParametresEntreprisePage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/parametres/entreprise". Charge les infos
  actuelles de l'entreprise depuis le backend (GET), et envoie les
  champs modifiés en une seule fois (PUT) — protégé par le token JWT
  du gérant connecté, pas besoin de ressaisir le mot de passe ici.
-->
<template>
  <GerantPageTemplate role="gerant">
    <header class="parametres-page__header">
      <h1 class="parametres-page__title">Paramètres</h1>
      <p class="parametres-page__subtitle">Gérez votre entreprise, votre sécurité et vos vendeurs</p>
    </header>

    <ParametresTabs />

    <div class="parametres-page__body">
      <div class="parametres-page__contenu">
        <p v-if="chargement" class="parametres-page__chargement">Chargement…</p>

        <template v-else>
          <p v-if="messageErreur" class="parametres-page__erreur">{{ messageErreur }}</p>
          <p v-if="messageSucces" class="parametres-page__succes">{{ messageSucces }}</p>

          <ParametresEntrepriseForm :valeurs="valeurs" @enregistrer="gererEnregistrement" />
        </template>
      </div>
    </div>
  </GerantPageTemplate>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import ParametresTabs from '../components/molecules/ParametresTabs.vue';
import ParametresEntrepriseForm from '../components/organisms/ParametresEntrepriseForm.vue';
import { get, put } from '../services/api';
import { useSession, ouvrirSession } from '../store/session';

const session = useSession();

const chargement = ref(true);
const messageErreur = ref('');
const messageSucces = ref('');

const valeurs = ref({
  nomEntreprise: '',
  email: '',
  secteurActivite: '',
  numeroEntreprise: '',
  nomGerant: '',
});

async function chargerValeurs() {
  chargement.value = true;
  messageErreur.value = '';
  try {
    const reponse = await get(`/entreprises/${encodeURIComponent(session.nomEntreprise.value)}`);
    valeurs.value = reponse;
  } catch (erreur) {
    messageErreur.value = erreur.message;
  } finally {
    chargement.value = false;
  }
}

onMounted(chargerValeurs);

async function gererEnregistrement(champsModifies) {
  messageErreur.value = '';
  messageSucces.value = '';

  if (Object.keys(champsModifies).length === 0) {
    messageErreur.value = 'Aucune modification à enregistrer.';
    return;
  }

  if (champsModifies.email && !champsModifies.email.includes('@')) {
    messageErreur.value = "L'adresse email doit contenir un @.";
    return;
  }

  try {
    const nomEntrepriseAvant = session.nomEntreprise.value;

    const entrepriseMiseAJour = await put(
      `/entreprises/${encodeURIComponent(nomEntrepriseAvant)}`,
      champsModifies
    );

    // Si le nom de l'entreprise a changé, la session (et donc toutes
    // les routes qui utilisent :nomEntreprise dans l'URL) doit
    // repartir sur le nouveau nom.
    ouvrirSession('gerant', entrepriseMiseAJour.nomEntreprise, entrepriseMiseAJour.nomGerant);

    valeurs.value = entrepriseMiseAJour;
    messageSucces.value = 'Modifications enregistrées.';
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
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

.parametres-page__contenu {
  max-width: 460px;
  width: 100%;
}

.parametres-page__chargement {
  font-size: 13px;
  color: var(--color-ink-muted);
  font-style: italic;
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
</style>