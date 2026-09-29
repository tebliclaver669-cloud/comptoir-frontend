/**
 * api.js
 * ----------------------------------------------------------------
 * Point central pour tous les appels au backend. Gère l'adresse du
 * serveur et l'ajout automatique du token dans les requêtes qui en
 * ont besoin, pour ne pas avoir à le refaire à chaque appel.
 */

const BASE_URL = 'http://localhost:4000/api';

export function obtenirToken() {
  return localStorage.getItem('comptoir_token');
}

export function enregistrerToken(token) {
  localStorage.setItem('comptoir_token', token);
}

export function supprimerToken() {
  localStorage.removeItem('comptoir_token');
}

async function requete(chemin, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = obtenirToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const reponse = await fetch(`${BASE_URL}${chemin}`, { ...options, headers });
  const texte = await reponse.text();
  const donnees = texte ? JSON.parse(texte) : null;

  if (!reponse.ok) {
    const erreur = new Error(donnees?.erreur || 'Une erreur est survenue.');
    // Le corps complet de la réponse d'erreur reste accessible via
    // erreur.donnees (ex: produitsProblematiques renvoyé par
    // /ventes/panier), pour les cas où le message seul ne suffit pas.
    erreur.donnees = donnees;
    erreur.statut = reponse.status;
    throw erreur;
  }

  return donnees;
}

export function get(chemin) {
  return requete(chemin, { method: 'GET' });
}

export function post(chemin, corps) {
  return requete(chemin, { method: 'POST', body: JSON.stringify(corps) });
}

export function put(chemin, corps) {
  return requete(chemin, { method: 'PUT', body: JSON.stringify(corps) });
}

export function del(chemin) {
  return requete(chemin, { method: 'DELETE' });
}