/**
 * vendeurs.js
 * ----------------------------------------------------------------
 * Gestion des vendeurs — entièrement basée sur le backend (plus de
 * localStorage, plus de vérification de mot de passe côté client :
 * toute vérification de mot de passe se fait désormais sur le
 * serveur, via bcrypt).
 */
import { get, post, put, del } from '../services/api';

// Charge la liste des vendeurs d'une entreprise. Le backend renvoie
// déjà "enLigne" (calculé depuis la dernière Connexion) et
// "motDePassePersonnalise" (empêche le gérant de réinitialiser le
// mot de passe si le vendeur l'a déjà changé lui-même).
export async function listerVendeursParEntreprise(nomEntreprise) {
  return get(`/vendeurs/${encodeURIComponent(nomEntreprise)}`);
}

// Crée un nouveau vendeur pour l'entreprise.
export async function creerVendeur(nomEntreprise, { nomPrenoms, email, telephone, motDePasse }) {
  return post('/vendeurs', { nomEntreprise, nomPrenoms, email, telephone, motDePasse });
}

// Met à jour les infos d'un vendeur, et éventuellement son mot de
// passe (uniquement si le vendeur ne l'a pas déjà personnalisé lui-
// même — vérifié côté serveur). motDePasseGerant est le mot de passe
// DU GÉRANT, vérifié côté serveur avant toute modification.
export async function mettreAJourVendeur(id, { nomPrenoms, email, telephone, nouveauMotDePasse, motDePasseGerant }) {
  return put(`/vendeurs/${encodeURIComponent(id)}`, {
    nomPrenoms,
    email,
    telephone,
    nouveauMotDePasse,
    motDePasseGerant,
  });
}

export async function supprimerVendeur(id) {
  return del(`/vendeurs/${encodeURIComponent(id)}`);
}

// Historique complet des connexions/déconnexions d'un vendeur.
export async function listerHistoriqueConnexions(nomEntreprise, vendeurId) {
  return get(`/vendeurs/${encodeURIComponent(nomEntreprise)}/${encodeURIComponent(vendeurId)}/connexions`);
}

// Connexion d'un vendeur (utilisée par le sélecteur de vendeur dans
// la sidebar) — vrai login backend. IMPORTANT : le backend attend la
// clé "nom" (comme ConnexionPage.vue), pas "nomPrenoms" — c'était le
// bug qui déclenchait le message "Merci de fournir nomEntreprise,
// nom et motDePasse."
export async function connecterVendeur(nomEntreprise, nom, motDePasse) {
  return post('/auth/connexion', { nomEntreprise, nom, motDePasse });
}

// Déconnexion d'un vendeur — enregistre une ligne "déconnexion" dans
// l'historique, via le token du vendeur actuellement connecté.
export async function enregistrerDeconnexionVendeur() {
  return post('/vendeurs/deconnexion', {});
}