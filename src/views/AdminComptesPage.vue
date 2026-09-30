<!--
  AdminComptesPage.vue (page)
  --------------------------------------------------------------
  Rôle : page routée sur "/admin/comptes". Liste toutes les
  entreprises (gérants) et tous les vendeurs, avec un bouton de
  suppression. AUCUNE modification n'est possible ici à part la
  suppression (conformément à la consigne : l'admin voit tout mais
  ne modifie rien, sauf supprimer des comptes).

  BRANCHÉ SUR LE VRAI BACKEND (routes /api/admin/...) : les listes
  sont chargées au montage (async), et la suppression se fait par
  identifiant (id), pas par nom — l'ancien code local a été retiré.
-->
<template>
  <GerantPageTemplate role="admin">
    <header class="admin-comptes-page__header">
      <h1 class="admin-comptes-page__title">Comptes</h1>
      <p class="admin-comptes-page__subtitle">Gérants et vendeurs inscrits sur la plateforme</p>
    </header>

    <p v-if="messageErreur" class="admin-comptes-page__erreur">{{ messageErreur }}</p>

    <section class="admin-comptes-page__section">
      <h2 class="admin-comptes-page__section-title">Gérants ({{ entreprises.length }})</h2>
      <div class="admin-comptes-page__table-wrap">
        <table class="admin-comptes-page__table">
          <thead>
            <tr><th>Entreprise</th><th>Secteur</th><th>Gérant</th><th class="admin-comptes-page__center">Action</th></tr>
          </thead>
          <tbody>
            <tr v-for="e in entreprises" :key="e.id">
              <td class="admin-comptes-page__nom">{{ e.nomEntreprise }}</td>
              <td>{{ e.secteurActivite }}</td>
              <td>{{ e.nomGerant }}</td>
              <td class="admin-comptes-page__center">
                <button type="button" class="admin-comptes-page__supprimer" @click="supprimerCompteEntreprise(e)">
                  Supprimer
                </button>
              </td>
            </tr>
            <tr v-if="entreprises.length === 0"><td colspan="4" class="admin-comptes-page__vide">Aucune entreprise inscrite.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="admin-comptes-page__section">
      <h2 class="admin-comptes-page__section-title">Vendeurs ({{ vendeurs.length }})</h2>
      <div class="admin-comptes-page__table-wrap">
        <table class="admin-comptes-page__table">
          <thead>
            <tr><th>Nom &amp; prénoms</th><th>Entreprise</th><th>Email</th><th class="admin-comptes-page__center">Action</th></tr>
          </thead>
          <tbody>
            <tr v-for="v in vendeurs" :key="v.id">
              <td class="admin-comptes-page__nom">{{ v.nomPrenoms }}</td>
              <td>{{ v.entreprise }}</td>
              <td>{{ v.email }}</td>
              <td class="admin-comptes-page__center">
                <button type="button" class="admin-comptes-page__supprimer" @click="supprimerCompteVendeur(v)">
                  Supprimer
                </button>
              </td>
            </tr>
            <tr v-if="vendeurs.length === 0"><td colspan="4" class="admin-comptes-page__vide">Aucun vendeur inscrit.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </GerantPageTemplate>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GerantPageTemplate from '../components/templates/GerantPageTemplate.vue';
import { listerEntreprises, supprimerEntreprise } from '../store/entreprises';
import { listerTousLesVendeurs, supprimerVendeurAdmin } from '../store/vendeurs';

const entreprises = ref([]);
const vendeurs = ref([]);
const messageErreur = ref('');

async function chargerTout() {
  messageErreur.value = '';
  try {
    entreprises.value = await listerEntreprises();
    vendeurs.value = await listerTousLesVendeurs();
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

async function supprimerCompteEntreprise(entreprise) {
  if (!window.confirm(`Supprimer définitivement l'entreprise "${entreprise.nomEntreprise}" ?`)) return;
  try {
    await supprimerEntreprise(entreprise.id);
    await chargerTout();
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

async function supprimerCompteVendeur(vendeur) {
  if (!window.confirm(`Supprimer définitivement le compte vendeur "${vendeur.nomPrenoms}" ?`)) return;
  try {
    await supprimerVendeurAdmin(vendeur.id);
    await chargerTout();
  } catch (erreur) {
    messageErreur.value = erreur.message;
  }
}

onMounted(chargerTout);
</script>

<style scoped>
.admin-comptes-page__header {
  padding: var(--space-lg) var(--space-xl) 0;
}

.admin-comptes-page__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.admin-comptes-page__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 var(--space-lg);
}

.admin-comptes-page__erreur {
  margin: 0 var(--space-xl) var(--space-md);
  font-size: 12.5px;
  color: #b3251d;
  font-style: italic;
}

.admin-comptes-page__section {
  padding: 0 var(--space-xl) var(--space-lg);
}

.admin-comptes-page__section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 var(--space-sm);
}

.admin-comptes-page__table-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.admin-comptes-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.admin-comptes-page__table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  padding: 10px 14px;
  background: var(--color-bg-table-header);
}

.admin-comptes-page__table th.admin-comptes-page__center { text-align: center; }

.admin-comptes-page__table td {
  padding: 11px 14px;
  border-top: 1px solid var(--color-bg-panel-muted);
}

.admin-comptes-page__nom {
  font-weight: 600;
  color: var(--color-ink);
}

.admin-comptes-page__center { text-align: center; }

.admin-comptes-page__supprimer {
  border: 1px solid var(--color-burgundy);
  background: transparent;
  color: var(--color-burgundy);
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}

.admin-comptes-page__vide {
  text-align: center;
  font-style: italic;
  color: var(--color-ink-muted);
  padding: var(--space-lg);
}
</style>