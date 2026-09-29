/**
 * entreprises.js
 * ----------------------------------------------------------------
 * Stockage local des entreprises inscrites. createdAt est
 * enregistré à l'inscription et sert de point de départ pour
 * l'historique des statistiques (années disponibles = de
 * l'inscription à aujourd'hui).
 */

const STORAGE_KEY = 'comptoir_entreprises';

function lireTout() {
  const brut = localStorage.getItem(STORAGE_KEY);
  return brut ? JSON.parse(brut) : [];
}

function ecrireTout(entreprises) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entreprises));
}

export function enregistrerEntreprise(donnees) {
  const entreprises = lireTout();
  const index = entreprises.findIndex((e) => e.nomEntreprise === donnees.nomEntreprise);

  if (index !== -1) {
    // On garde la date de création d'origine si l'entreprise existait déjà.
    entreprises[index] = { ...donnees, createdAt: entreprises[index].createdAt || new Date().toISOString() };
  } else {
    entreprises.push({ ...donnees, createdAt: new Date().toISOString() });
  }

  ecrireTout(entreprises);
}

export function trouverEntreprise(nomEntreprise) {
  return lireTout().find((e) => e.nomEntreprise === nomEntreprise) || null;
}

export function motDePasseValide(nomEntreprise, motDePasseSaisi) {
  const entreprise = trouverEntreprise(nomEntreprise);
  return !!entreprise && entreprise.motDePasse === motDePasseSaisi;
}

export function gerantValide(nomEntreprise, nomSaisi, motDePasseSaisi) {
  const entreprise = trouverEntreprise(nomEntreprise);
  return !!entreprise && entreprise.nomGerant === nomSaisi && entreprise.motDePasse === motDePasseSaisi;
}

export function mettreAJourEntreprise(nomEntrepriseActuel, nouvellesDonnees) {
  const entreprises = lireTout();
  const index = entreprises.findIndex((e) => e.nomEntreprise === nomEntrepriseActuel);
  if (index === -1) return null;

  entreprises[index] = { ...entreprises[index], ...nouvellesDonnees };
  ecrireTout(entreprises);
  return entreprises[index];
}

// Année à partir de laquelle l'historique doit commencer : celle où
// l'entreprise s'est inscrite sur l'app (pas avant, comme demandé).
export function obtenirAnneeCreation(nomEntreprise) {
  const entreprise = trouverEntreprise(nomEntreprise);
  if (!entreprise || !entreprise.createdAt) return new Date().getFullYear();
  return new Date(entreprise.createdAt).getFullYear();
}