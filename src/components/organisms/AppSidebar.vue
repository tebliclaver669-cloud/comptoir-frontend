<!--
  AppSidebar.vue (organism)
  --------------------------------------------------------------
  Rôle : menu latéral de l'espace interne, pour 3 rôles (gérant,
  vendeur, admin). Ordre fixe (Tableau de bord en premier). Le
  bouton "+ Ajouter un vendeur" n'apparaît que pour le gérant et
  ouvre un petit menu à 2 options : "Connecter un vendeur" (déjà
  inscrit — il saisit lui-même son nom + mot de passe pour ouvrir sa
  propre session, via une VRAIE connexion backend désormais) ou
  "Inscrire un vendeur" (nouveau — direction le formulaire
  d'inscription). Le bouton "Paramètres" (gérant) ouvre un petit menu
  avec 3 options (Modifier profil, Sécurité, Gestion des vendeurs) au
  lieu d'ouvrir directement une page unique. Le vendeur a son propre
  bouton "Options", qui ouvre directement sa page de modification
  de profil (nom, email, téléphone, mot de passe) sans sous-menu.
  Déconnexion reste fixée en bas.

  Props :
    - role : 'gerant' (par défaut) | 'vendeur' | 'admin'
-->
<template>
  <aside class="app-sidebar app-sidebar--entree">
    <div class="app-sidebar__top">
      <SidebarBrand />
      <nav class="app-sidebar__nav">
        <SidebarNavItem
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="item.label"
        />
      </nav>
    </div>

    <div class="app-sidebar__bottom">
      <div v-if="role === 'gerant'" class="app-sidebar__ajouter-vendeur-wrap">
        <div v-if="menuAjouterVendeurOuvert" class="app-sidebar__ajouter-vendeur-popover">
          <button type="button" class="app-sidebar__ajouter-vendeur-option" @click="ouvrirConnecterVendeur">
            Connecter un vendeur
            <span class="app-sidebar__ajouter-vendeur-option-sous">déjà inscrit</span>
          </button>
          <button type="button" class="app-sidebar__ajouter-vendeur-option" @click="allerVersInscriptionVendeur">
            Inscrire un vendeur
            <span class="app-sidebar__ajouter-vendeur-option-sous">nouveau</span>
          </button>
        </div>

        <button
          type="button"
          class="app-sidebar__ajouter-vendeur"
          @click="menuAjouterVendeurOuvert = !menuAjouterVendeurOuvert"
        >
          + Ajouter un vendeur
        </button>
      </div>

      <div v-if="role === 'gerant'" class="app-sidebar__parametres-wrap">
        <div v-if="menuParametresOuvert" class="app-sidebar__parametres-popover">
          <router-link to="/parametres/entreprise" class="app-sidebar__parametres-option" @click="menuParametresOuvert = false">
            Modifier profil
          </router-link>
          <router-link to="/parametres/securite" class="app-sidebar__parametres-option" @click="menuParametresOuvert = false">
            Sécurité
          </router-link>
          <router-link to="/parametres/vendeurs" class="app-sidebar__parametres-option" @click="menuParametresOuvert = false">
            Gestion des vendeurs
          </router-link>
        </div>

        <button type="button" class="app-sidebar__parametres" @click="menuParametresOuvert = !menuParametresOuvert">
          <span class="app-sidebar__parametres-icon" aria-hidden="true" v-html="ICONE_PARAMETRES"></span>
          Paramètres
        </button>
      </div>

      <button
        v-if="role === 'vendeur'"
        type="button"
        class="app-sidebar__parametres"
        @click="router.push('/options-vendeur')"
      >
        <span class="app-sidebar__parametres-icon" aria-hidden="true" v-html="ICONE_PARAMETRES"></span>
        Options
      </button>

      <button type="button" class="app-sidebar__logout" @click="seDeconnecter">
        <span class="app-sidebar__logout-icon" aria-hidden="true">⏻</span>
        Déconnexion
      </button>
    </div>

    <ConnecterVendeurModal
      v-if="afficherModaleConnecterVendeur"
      :erreur="erreurConnexionVendeur"
      @connecter="gererConnexionVendeur"
      @fermer="afficherModaleConnecterVendeur = false"
    />
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SidebarBrand from '../atoms/SidebarBrand.vue';
import SidebarNavItem from '../molecules/SidebarNavItem.vue';
import ConnecterVendeurModal from './ConnecterVendeurModal.vue';
import { fermerSession, ouvrirSession, useSession, dernierEntrepriseConnue } from '../../store/session';
import { connecterVendeur, enregistrerDeconnexionVendeur } from '../../store/vendeurs';
import { enregistrerToken, supprimerToken } from '../../services/api';
import { chargerProduits } from '../../store/produits';

const props = defineProps({
  role: {
    type: String,
    default: 'gerant',
    validator: (v) => ['gerant', 'vendeur', 'admin'].includes(v),
  },
});

const router = useRouter();
const session = useSession();

const menuParametresOuvert = ref(false);
const menuAjouterVendeurOuvert = ref(false);
const afficherModaleConnecterVendeur = ref(false);
const erreurConnexionVendeur = ref('');

const ICONE_TABLEAU_DE_BORD = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>';
const ICONE_CATALOGUE = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L3 3v6.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.82 0l4.6-4.6a2 2 0 0 0 0-2.82Z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICONE_APPROVISIONNEMENT = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 4 21 9 16 9"/></svg>';
const ICONE_STATISTIQUES = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>';
const ICONE_HISTORIQUE = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>';
const ICONE_COMPTES = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
const ICONE_VUE_ENSEMBLE = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>';
const ICONE_PARAMETRES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>';

const menuItemsParRole = {
  gerant: [
    { to: '/tableau-de-bord', icon: ICONE_TABLEAU_DE_BORD, label: 'Tableau de bord' },
    { to: '/catalogue', icon: ICONE_CATALOGUE, label: 'Catalogue produits' },
    { to: '/approvisionnement', icon: ICONE_APPROVISIONNEMENT, label: 'Approvisionement' },
    { to: '/historique', icon: ICONE_HISTORIQUE, label: 'Historique' },
    { to: '/statistiques', icon: ICONE_STATISTIQUES, label: 'Statistiques' },
  ],
  vendeur: [
    { to: '/tableau-de-bord-vendeur', icon: ICONE_TABLEAU_DE_BORD, label: 'Tableau de bord' },
    { to: '/catalogue-vendeur', icon: ICONE_CATALOGUE, label: 'Catalogue produits' },
    { to: '/historique-vendeur', icon: ICONE_HISTORIQUE, label: 'Historique' },
  ],
  admin: [
    { to: '/admin/vue-ensemble', icon: ICONE_VUE_ENSEMBLE, label: "Vue d'ensemble" },
    { to: '/admin/comptes', icon: ICONE_COMPTES, label: 'Comptes' },
  ],
};

const menuItems = computed(() => menuItemsParRole[props.role]);

function allerVersInscriptionVendeur() {
  menuAjouterVendeurOuvert.value = false;
  router.push({ path: '/inscription-vendeur', query: { entreprise: session.nomEntreprise.value } });
}

function ouvrirConnecterVendeur() {
  menuAjouterVendeurOuvert.value = false;
  erreurConnexionVendeur.value = '';
  afficherModaleConnecterVendeur.value = true;
}

// Un vendeur déjà inscrit saisit lui-même son nom + mot de passe
// (pas le gérant) pour ouvrir sa propre session sur cet appareil —
// désormais une VRAIE connexion backend (vérifie le mot de passe
// haché, obtient un token, journalise la connexion), exactement
// comme depuis la page de connexion dédiée.
async function gererConnexionVendeur({ nom, motDePasse }) {
  const entreprise = session.nomEntreprise.value;

  try {
    const reponse = await connecterVendeur(entreprise, nom, motDePasse);
    enregistrerToken(reponse.token);
    ouvrirSession(reponse.role, reponse.nomEntreprise, reponse.nom);
    await chargerProduits(reponse.nomEntreprise);

    erreurConnexionVendeur.value = '';
    afficherModaleConnecterVendeur.value = false;
    router.push('/tableau-de-bord-vendeur');
  } catch (erreur) {
    erreurConnexionVendeur.value = erreur.message;
  }
}

async function seDeconnecter() {
  const roleActuel = session.role.value;
  const entrepriseActuelle = session.nomEntreprise.value || dernierEntrepriseConnue();

  if (roleActuel === 'vendeur') {
    try {
      await enregistrerDeconnexionVendeur();
    } catch {
      // Non bloquant : la déconnexion locale continue même si
      // l'enregistrement du statut échoue (ex. réseau coupé).
    }
  }

  fermerSession();
  supprimerToken();

  if (roleActuel === 'admin') {
    router.push('/connexion-admin');
  } else {
    router.push({ path: '/connexion', query: { entreprise: entrepriseActuelle } });
  }
}
</script>

<style scoped>
.app-sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background: var(--color-bg-sidebar);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-lg) 0;
  box-sizing: border-box;
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: 32px;
}

.app-sidebar__bottom {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.app-sidebar__ajouter-vendeur {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0 var(--space-sm);
  padding: 9px 11px;
  border: 1px dashed var(--color-tan);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-tan);
  font-weight: 600;
  font-size: 12.5px;
  font-family: var(--font-interface);
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease,
    transform 0.2s ease, box-shadow 0.25s ease;
}

.app-sidebar__ajouter-vendeur:hover {
  background: rgba(169, 130, 92, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(169, 130, 92, 0.25);
}

.app-sidebar__ajouter-vendeur:active {
  transform: translateY(0);
}

.app-sidebar__ajouter-vendeur-wrap {
  position: relative;
  margin: 0 var(--space-sm);
}

.app-sidebar__ajouter-vendeur-popover {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  width: 220px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-sidebar__ajouter-vendeur-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-ink);
  font-size: 12.5px;
  font-weight: 500;
  font-family: var(--font-interface);
  text-align: left;
  cursor: pointer;
}

.app-sidebar__ajouter-vendeur-option:hover {
  background: var(--color-green-soft);
}

.app-sidebar__ajouter-vendeur-option-sous {
  font-size: 10.5px;
  font-weight: 400;
  color: var(--color-ink-muted);
}

.app-sidebar__ajouter-vendeur-wrap .app-sidebar__ajouter-vendeur {
  margin: 0;
  width: 100%;
}

.app-sidebar__parametres-wrap {
  position: relative;
  margin: 0 var(--space-sm);
}

.app-sidebar__parametres-popover {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  width: 220px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-sidebar__parametres-option {
  display: block;
  padding: 8px 10px;
  border-radius: 6px;
  color: var(--color-ink);
  font-size: 12.5px;
  font-weight: 500;
  text-decoration: none;
}

.app-sidebar__parametres-option:hover {
  background: var(--color-green-soft);
}

.app-sidebar__parametres {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 11px;
  border: 1px solid #3A4653;
  border-radius: var(--radius-md);
  background: transparent;
  color: #94A0AD;
  font-weight: 500;
  font-size: 12.5px;
  font-family: var(--font-interface);
  cursor: pointer;
  box-sizing: border-box;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease,
    transform 0.2s ease, box-shadow 0.25s ease;
}

.app-sidebar__parametres:hover {
  background: rgba(169, 130, 92, 0.12);
  color: var(--color-tan);
  border-color: var(--color-tan);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(169, 130, 92, 0.25);
}

.app-sidebar__parametres:active {
  transform: translateY(0);
}

.app-sidebar__parametres:hover .app-sidebar__parametres-icon {
  transform: rotate(90deg);
}

.app-sidebar__parametres-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  transition: transform 0.4s ease;
}

.app-sidebar__parametres-icon :deep(svg) {
  width: 15px;
  height: 15px;
}

.app-sidebar__logout {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 var(--space-sm);
  padding: 9px 11px;
  border: 1px solid #3A4653;
  border-radius: var(--radius-md);
  background: transparent;
  color: #94A0AD;
  font-weight: 500;
  font-size: 12.5px;
  font-family: var(--font-interface);
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease,
    transform 0.2s ease, box-shadow 0.25s ease;
}

.app-sidebar__logout:hover {
  background: rgba(140, 53, 39, 0.15);
  color: #E9C6C0;
  border-color: var(--color-burgundy);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(140, 53, 39, 0.3);
}

.app-sidebar__logout:active {
  transform: translateY(0);
}

.app-sidebar__logout-icon {
  font-size: 14px;
}
.app-sidebar--entree {
  animation: sidebar-glisser-entree 0.35s ease-out;
}

@keyframes sidebar-glisser-entree {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>