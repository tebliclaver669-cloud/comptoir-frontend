/**
 * panier.js
 * ----------------------------------------------------------------
 * État du panier de vente en cours, partagé par CatalogueVendeurTable
 * (qui y ajoute des lignes) et PanierWidget (qui l'affiche et le
 * valide). Un seul panier actif à la fois -> état module-level en
 * reactive plutôt qu'un store par composant.
 *
 * Remise : optionnelle, définie avant validation. Elle vise soit tout
 * le panier ("__total__"), soit un seul produit du panier (son nom).
 * Elle est toujours plafonnée à la valeur de sa cible (impossible de
 * dépasser le total du panier, ou le total de la ligne visée).
 */
import { reactive, computed } from 'vue';

const items = reactive([]);

const remise = reactive({ cible: '__total__', montant: 0 });

export function ajouterAuPanier(produit, quantite) {
  const qte = parseInt(quantite, 10);
  if (!qte || qte <= 0) return;

  const existant = items.find((i) => i.nom === produit.nom);
  if (existant) {
    existant.quantite += qte;
  } else {
    items.push({ nom: produit.nom, prixUnitaire: produit.prixVente, quantite: qte });
  }
}

export function retirerDuPanier(nom) {
  const index = items.findIndex((i) => i.nom === nom);
  if (index !== -1) items.splice(index, 1);

  // Si la remise ciblait ce produit précis, elle n'a plus de sens.
  if (remise.cible === nom) {
    remise.cible = '__total__';
    remise.montant = 0;
  }
}

// cible : '__total__' ou le nom d'un produit du panier.
// montant : chaîne ou nombre, en CFA — nettoyé en entier positif.
export function definirRemise(cible, montant) {
  remise.cible = cible || '__total__';
  const chiffres = (montant ?? '').toString().replace(/[^\d]/g, '');
  remise.montant = chiffres ? parseInt(chiffres, 10) : 0;
}

export function viderPanier() {
  items.splice(0, items.length);
  remise.cible = '__total__';
  remise.montant = 0;
}

export function usePanier() {
  const total = computed(() => items.reduce((s, i) => s + i.quantite * i.prixUnitaire, 0));
  const nombreArticles = computed(() => items.reduce((s, i) => s + i.quantite, 0));

  const remiseEffective = computed(() => {
    if (remise.montant <= 0) return 0;
    if (remise.cible === '__total__') return Math.min(remise.montant, total.value);
    const ligne = items.find((i) => i.nom === remise.cible);
    const totalLigne = ligne ? ligne.quantite * ligne.prixUnitaire : 0;
    return Math.min(remise.montant, totalLigne);
  });

  const totalNet = computed(() => total.value - remiseEffective.value);

  // Répartit la remise effective sur les lignes du panier, pour
  // l'envoi au backend : chaque Vente créée garde sa propre part de
  // remise. Si la remise vise tout le panier, elle est répartie au
  // prorata du poids de chaque ligne ; le reliquat d'arrondi est mis
  // sur la dernière ligne pour que la somme retombe exactement juste.
  function itemsAvecRemise() {
    if (remiseEffective.value <= 0) {
      return items.map((i) => ({ ...i, remise: 0 }));
    }

    if (remise.cible !== '__total__') {
      return items.map((i) => ({ ...i, remise: i.nom === remise.cible ? remiseEffective.value : 0 }));
    }

    let resteARepartir = remiseEffective.value;
    return items.map((i, index) => {
      const totalLigne = i.quantite * i.prixUnitaire;
      const estDerniere = index === items.length - 1;
      const part = estDerniere
        ? resteARepartir
        : Math.round((totalLigne / total.value) * remiseEffective.value);
      resteARepartir -= part;
      return { ...i, remise: Math.max(0, part) };
    });
  }

  return { items, total, nombreArticles, remise, remiseEffective, totalNet, itemsAvecRemise };
}