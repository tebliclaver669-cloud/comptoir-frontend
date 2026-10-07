// Adresse du backend, par ordre de priorité :
//   1. VITE_API_URL si elle est définie (variable d'environnement
//      Vercel, ou fichier .env en local) ;
//   2. en développement (npm run dev) : localhost:4000 ;
//   3. en production (site déployé sur Vercel) : le backend Render.
// Cette adresse n'a rien de secret : elle est de toute façon visible
// dans le code envoyé au navigateur.
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:4000/api' : 'https://comptoir-api-kvf0.onrender.com/api');

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

  let reponse;
  try {
    reponse = await fetch(`${BASE_URL}${chemin}`, { ...options, headers });
  } catch {
    throw new Error('Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez dans une minute.');
  }

  const texte = await reponse.text();

  // Le serveur doit répondre en JSON. Si ce n'est pas le cas (page HTML
  // "serveur en cours de réveil" de Render, route introuvable, etc.), on
  // affiche un message compréhensible avec le code HTTP pour diagnostiquer.
  let donnees = null;
  if (texte) {
    try {
      donnees = JSON.parse(texte);
    } catch {
      const erreur = new Error(
        `Le serveur n'a pas répondu correctement (code ${reponse.status}). ` +
          'Il est peut-être en train de se réveiller : réessayez dans une minute.'
      );
      erreur.statut = reponse.status;
      throw erreur;
    }
  }

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