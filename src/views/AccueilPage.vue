<!--
  AccueilPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/". BRANCHÉ SUR LE VRAI BACKEND
  (2026-09-21) : gererConnexion() appelle GET
  /api/entreprises/:nomEntreprise/existe pour savoir si
  l'entreprise existe déjà dans PostgreSQL, et redirige en
  conséquence vers Connexion ou Inscription.
-->
<template>
  <div class="accueil-page__wrapper">
    <PublicPageTemplate
      v-model="nomEntreprise"
      @login="gererConnexion"
      @signup="allerVersInscription"
      @help-click="afficherAide"
    >
      <p v-if="messageErreur" class="accueil-page__erreur">{{ messageErreur }}</p>
    </PublicPageTemplate>

    <section class="accueil-page__valeurs">
      <div class="accueil-page__valeur">
        <div class="accueil-page__valeur-icone">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F4A3C" stroke-width="2">
            <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L3 3v6.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.82 0l4.6-4.6a2 2 0 0 0 0-2.82Z" />
            <circle cx="7.5" cy="7.5" r="1.5" fill="#2F4A3C" stroke="none" />
          </svg>
        </div>
        <p class="accueil-page__valeur-titre">Stock en temps réel</p>
        <p class="accueil-page__valeur-texte">Suivez chaque référence et anticipez les ruptures avant qu'elles n'arrivent.</p>
      </div>

      <div class="accueil-page__valeur">
        <div class="accueil-page__valeur-icone">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F4A3C" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <p class="accueil-page__valeur-titre">Ventes et statistiques</p>
        <p class="accueil-page__valeur-texte">Analysez vos performances mensuelles et annuelles en un coup d'œil.</p>
      </div>

      <div class="accueil-page__valeur">
        <div class="accueil-page__valeur-icone">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F4A3C" stroke-width="2">
            <path d="M3 21h18" />
            <path d="M5 21V9l7-5 7 5v12" />
            <path d="M9 21v-6h6v6" />
          </svg>
        </div>
        <p class="accueil-page__valeur-titre">Pensé pour les commerces</p>
        <p class="accueil-page__valeur-texte">Boutiques, supermarchés, pharmacies : quelle que soit votre taille, Comptoir s'adapte.</p>
      </div>
    </section>

    <footer class="accueil-page__footer">
      <p>© 2026 Comptoir — Suivi de stock &amp; analyse de vente</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PublicPageTemplate from '../components/templates/PublicPageTemplate.vue';
import { get } from '../services/api';

const router = useRouter();

const nomEntreprise = ref('');
const messageErreur = ref('');

async function gererConnexion() {
  if (!nomEntreprise.value.trim()) {
    messageErreur.value = "Merci de saisir le nom de l'entreprise.";
    return;
  }

  try {
    const reponse = await get(`/entreprises/${encodeURIComponent(nomEntreprise.value)}/existe`);

    messageErreur.value = '';

    if (!reponse.existe) {
      router.push({ path: '/inscription', query: { entreprise: nomEntreprise.value } });
    } else {
      router.push({ path: '/connexion', query: { entreprise: nomEntreprise.value } });
    }
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

function allerVersInscription() {
  router.push('/inscription');
}

function afficherAide() {
  window.alert('Aide : contactez votre administrateur pour toute question.');
}
</script>

<style scoped>
.accueil-page__wrapper {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background: #EDE7D6;
}

.accueil-page__erreur {
  color: #b3251d;
  font-style: italic;
  margin: 0;
}

.accueil-page__valeurs {
  flex: 1;
  background: #DCE6D9;
  padding: 48px 28px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  align-content: center;
}

.accueil-page__valeur {
  text-align: center;
  max-width: 320px;
  margin: 0 auto;
}

.accueil-page__valeur-icone {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #FBF8F1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accueil-page__valeur-titre {
  font-weight: 600;
  font-size: 14px;
  color: #233F1E;
  margin: 0 0 6px;
}

.accueil-page__valeur-texte {
  font-size: 12.5px;
  color: #3B5D34;
  margin: 0;
  line-height: 1.5;
}

.accueil-page__footer {
  background: #16212B;
  padding: 16px 28px;
  text-align: center;
}

.accueil-page__footer p {
  margin: 0;
  font-size: 11px;
  color: #8B93A0;
}

@media (max-width: 860px) {
  .accueil-page__valeurs {
    grid-template-columns: 1fr;
  }
}
</style>