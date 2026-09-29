/**
 * produits.js
 * ----------------------------------------------------------------
 * Liste des produits PARTAGÉE entre Catalogue, Approvisionnement et
 * Tableau de bord (au lieu d'une liste locale par page, qui
 * empêchait toute synchronisation). reactive() plutôt que ref() :
 * on modifie le tableau en place (push, Object.assign) et tous les
 * composants qui l'utilisent se mettent à jour automatiquement.
 */
import { reactive } from 'vue';
import { get, post, put, del } from '../services/api';

const produits = reactive([]);

export function listerProduits() {
  return produits;
}

// Le backend nomme le stock "stockActuel" et donne un "id" ; les
// pages, elles, lisent "stock" : on traduit ici, à un seul endroit.
function depuisBackend(p) {
  return {
    id: p.id,
    nom: p.nom,
    categorie: p.categorie,
    prixAchat: p.prixAchat,
    prixVente: p.prixVente,
    stock: p.stockActuel,
    seuilAlerte: p.seuilAlerte,
    fournisseurNom: p.fournisseur?.nom || '',
    fournisseurTel: p.fournisseur?.telephone || '',
  };
}

// Charge les produits depuis le backend et remplace le contenu du
// tableau EN PLACE (splice) pour que les pages qui l'utilisent déjà
// se mettent à jour. Le backend n'y renvoie jamais les produits
// archivés (déjà vendus, retirés du stock actif).
export async function chargerProduits(nomEntreprise) {
  const reponse = await get(`/produits/${encodeURIComponent(nomEntreprise)}`);
  produits.splice(0, produits.length, ...reponse.map(depuisBackend));
}

// Enregistre un nouveau produit dans la base, puis l'ajoute à la
// liste locale avec l'id donné par le serveur. fournisseurNom /
// fournisseurTel sont transmis dès la création (avant, ils étaient
// silencieusement ignorés : le fournisseur saisi dans
// AjouterProduitForm n'était jamais envoyé au backend, d'où
// l'obligation de repasser par le crayon après coup pour l'ajouter).
export async function creerProduit(nomEntreprise, donnees) {
  const cree = await post('/produits', {
    nomEntreprise,
    nom: donnees.nom,
    categorie: donnees.categorie,
    prixAchat: donnees.prixAchat,
    prixVente: donnees.prixVente,
    stockActuel: donnees.stock || 0,
    fournisseurNom: donnees.fournisseurNom || '',
    fournisseurTel: donnees.fournisseurTel || '',
  });
  produits.push(depuisBackend(cree));
}

// Supprime plusieurs produits (un appel serveur par produit).
// - Suppression définitive -> le serveur répond 204, retiré de la
//   liste.
// - Produit déjà vendu -> le serveur l'archive et répond 200 avec
//   un message ; retiré de la liste locale (il ne doit plus
//   apparaître dans le stock actif) et son message est renvoyé à
//   part, pour que la page puisse le distinguer d'un échec.
// Retourne { echecs: [{ nom, message }], archives: [{ nom, message }] }.
export async function supprimerProduits(ids) {
  const echecs = [];
  const archives = [];

  for (const id of ids) {
    const produit = produits.find((p) => p.id === id);
    try {
      const reponse = await del(`/produits/${encodeURIComponent(id)}`);
      const index = produits.findIndex((p) => p.id === id);
      if (index !== -1) produits.splice(index, 1);

      if (reponse?.archive) {
        archives.push({ nom: produit?.nom || id, message: reponse.message });
      }
    } catch (erreur) {
      echecs.push({ nom: produit?.nom || id, message: erreur.message });
    }
  }

  return { echecs, archives };
}

export function trouverProduitParNom(nom) {
  return produits.find((p) => p.nom === nom) || null;
}

export function ajouterProduit(donnees) {
  produits.push({ seuilAlerte: 0, fournisseurNom: '', fournisseurTel: '', ...donnees });
}

export function mettreAJourProduit(nom, changements) {
  const produit = trouverProduitParNom(nom);
  if (produit) Object.assign(produit, changements);
}

// Enregistre (ou retire) le fournisseur d'un produit CÔTÉ BACKEND,
// via PUT /api/produits/:id (qui crée/relie un vrai Fournisseur en
// base).
export async function mettreAJourFournisseur(produitId, { fournisseurNom, fournisseurTel }) {
  const produitMisAJour = await put(`/produits/${encodeURIComponent(produitId)}`, {
    fournisseurNom,
    fournisseurTel,
  });

  const produit = produits.find((p) => p.id === produitId);
  if (produit) {
    produit.fournisseurNom = produitMisAJour.fournisseur?.nom || '';
    produit.fournisseurTel = produitMisAJour.fournisseur?.telephone || '';
  }
}

// Enregistre prix d'achat / prix de vente / seuil d'alerte CÔTÉ
// BACKEND (PUT /api/produits/:id) — remplace mettreAJourProduit
// (local uniquement) qui perdait ces changements au rechargement
// de la page (c'était le bug du seuil qui "disparaissait").
export async function mettreAJourInfosProduit(produitId, { prixAchat, prixVente, seuilAlerte }) {
  const produitMisAJour = await put(`/produits/${encodeURIComponent(produitId)}`, {
    prixAchat,
    prixVente,
    seuilAlerte,
  });

  const produit = produits.find((p) => p.id === produitId);
  if (produit) {
    produit.prixAchat = produitMisAJour.prixAchat;
    produit.prixVente = produitMisAJour.prixVente;
    produit.seuilAlerte = produitMisAJour.seuilAlerte;
  }
}

export function ajusterStock(nom, delta) {
  const produit = trouverProduitParNom(nom);
  if (produit) produit.stock += delta;
}