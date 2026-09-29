/**
 * session.js
 * ----------------------------------------------------------------
 * État de connexion courant. Persisté dans localStorage (rôle, nom
 * d'entreprise, nom d'utilisateur) pour survivre à un rechargement
 * de page (F5) : le token JWT (voir services/api.js) survit déjà à
 * un F5 et continue de fonctionner pour les appels API, donc il n'y
 * a pas de raison que le rôle/nom affiché à l'écran, eux, se vident
 * pendant que l'utilisateur reste réellement connecté. Rempli par
 * ConnexionPage/ConnexionVendeurPage à la connexion, vidé par le
 * bouton Déconnexion de la sidebar.
 *
 * Le nom de l'entreprise a un traitement à part : il n'est PAS effacé
 * à la déconnexion (voir fermerSession), car la page de connexion
 * sert à reconnecter différents utilisateurs (gérant, vendeurs) d'une
 * MÊME entreprise, donc on ne doit jamais perdre ce contexte après
 * une déconnexion (ou un rechargement accidentel de page) — sinon la
 * pastille de la page de connexion retombe sur un texte de secours
 * qui ne correspond à aucune entreprise réelle.
 */
import { ref } from 'vue';

const STORAGE_KEY_ENTREPRISE = 'comptoir_entreprise_courante';
const STORAGE_KEY_ROLE = 'comptoir_role_courant';
const STORAGE_KEY_UTILISATEUR = 'comptoir_utilisateur_courant';

function lireDerniereEntreprise() {
  return localStorage.getItem(STORAGE_KEY_ENTREPRISE) || '';
}

function lireDernierRole() {
  return localStorage.getItem(STORAGE_KEY_ROLE) || null;
}

function lireDernierUtilisateur() {
  return localStorage.getItem(STORAGE_KEY_UTILISATEUR) || '';
}

// 'gerant' | 'vendeur' | 'admin' | null (pas connecté) — restauré
// depuis localStorage au chargement du module, pas remis à zéro par
// un simple F5.
const role = ref(lireDernierRole());
const nomEntreprise = ref(lireDerniereEntreprise());
const nomUtilisateur = ref(lireDernierUtilisateur());

export function ouvrirSession(nouveauRole, entreprise, utilisateur) {
  role.value = nouveauRole;
  nomEntreprise.value = entreprise;
  nomUtilisateur.value = utilisateur;

  if (entreprise) {
    localStorage.setItem(STORAGE_KEY_ENTREPRISE, entreprise);
  }
  if (nouveauRole) {
    localStorage.setItem(STORAGE_KEY_ROLE, nouveauRole);
  }
  localStorage.setItem(STORAGE_KEY_UTILISATEUR, utilisateur || '');
}

export function fermerSession() {
  role.value = null;
  nomUtilisateur.value = '';
  localStorage.removeItem(STORAGE_KEY_ROLE);
  localStorage.removeItem(STORAGE_KEY_UTILISATEUR);
  // nomEntreprise n'est volontairement PAS effacé : voir l'explication
  // en tête de fichier.
}

export function useSession() {
  return { role, nomEntreprise, nomUtilisateur };
}

// Utilisé par les pages de connexion pour retrouver l'entreprise en
// cours quand aucun ?entreprise=... n'est présent dans l'URL (par
// exemple juste après une déconnexion).
export function dernierEntrepriseConnue() {
  return lireDerniereEntreprise();
}