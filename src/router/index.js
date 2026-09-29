import { createRouter, createWebHistory } from 'vue-router';
import AccueilPage from '../views/AccueilPage.vue';
import { useSession } from '../store/session';

/*
 * On enregistre au fur et à mesure une route par page/maquette
 * reçue. Les routes commentées ci-dessous seront décommentées et
 * complétées quand on construira les pages correspondantes.
 *
 * meta.role : quand présent, la page est réservée à ce rôle
 * ('gerant' | 'vendeur' | 'admin'). La garde de navigation
 * ci-dessous (router.beforeEach) empêche strictement un gérant de
 * se retrouver sur une page vendeur et inversement, quelle que soit
 * la cause (clic, onglet resté ouvert avec une autre session,
 * historique du navigateur, etc.) : les deux espaces sont désormais
 * séparés au niveau du routeur lui-même, pas seulement par convention.
 */
const routes = [
  { path: '/', name: 'accueil', component: AccueilPage },
  { path: '/statistiques', name: 'statistiques', component: () => import('../views/StatistiquesPage.vue'), meta: { role: 'gerant' } },
  {
    path: '/inscription',
    name: 'inscription',
    component: () => import('../views/InscriptionEntreprisePage.vue'),
  },
  {
    path: '/connexion',
    name: 'connexion',
    component: () => import('../views/ConnexionPage.vue'),
  },
  {
    path: '/connexion-vendeur',
    name: 'connexion-vendeur',
    component: () => import('../views/ConnexionVendeurPage.vue'),
  },
  {
    path: '/inscription-vendeur',
    name: 'inscription-vendeur',
    component: () => import('../views/InscriptionVendeurPage.vue'),
  },
  {
    path: '/tableau-de-bord',
    name: 'tableau-de-bord',
    component: () => import('../views/TableauDeBordPage.vue'),
    meta: { role: 'gerant' },
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: () => import('../views/CataloguePage.vue'),
    meta: { role: 'gerant' },
  },
  {
    path: '/tableau-de-bord-vendeur',
    name: 'tableau-de-bord-vendeur',
    component: () => import('../views/TableauDeBordVendeurPage.vue'),
    meta: { role: 'vendeur' },
  },
  {
    path: '/catalogue-vendeur',
    name: 'catalogue-vendeur',
    component: () => import('../views/CatalogueVendeurPage.vue'),
    meta: { role: 'vendeur' },
  },
  {
    path: '/approvisionnement',
    name: 'approvisionnement',
    component: () => import('../views/ApprovisionnementPage.vue'),
    meta: { role: 'gerant' },
  },
  {
    path: '/historique-vendeur',
    name: 'historique-vendeur',
    component: () => import('../views/HistoriqueVendeurPage.vue'),
    meta: { role: 'vendeur' },
  },
  {
    path: '/historique',
    name: 'historique',
    component: () => import('../views/HistoriquePage.vue'),
    meta: { role: 'gerant' },
  },
  {
    path: '/connexion-admin',
    name: 'connexion-admin',
    component: () => import('../views/ConnexionAdminPage.vue'),
  },
  {
    path: '/admin/comptes',
    name: 'admin-comptes',
    component: () => import('../views/AdminComptesPage.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/vue-ensemble',
    name: 'admin-vue-ensemble',
    component: () => import('../views/AdminVueEnsemblePage.vue'),
    meta: { role: 'admin' },
  },
  { path: '/parametres', redirect: '/parametres/entreprise' },
  {
    path: '/parametres/entreprise',
    name: 'parametres-entreprise',
    component: () => import('../views/ParametresEntreprisePage.vue'),
    meta: { role: 'gerant' },
  },
  {
    path: '/parametres/securite',
    name: 'parametres-securite',
    component: () => import('../views/ParametresSecuritePage.vue'),
    meta: { role: 'gerant' },
  },
  {
    path: '/parametres/vendeurs',
    name: 'parametres-vendeurs',
    component: () => import('../views/ParametresVendeursPage.vue'),
    meta: { role: 'gerant' },
  },
  {
    path: '/options-vendeur',
    name: 'options-vendeur',
    component: () => import('../views/OptionsVendeurPage.vue'),
    meta: { role: 'vendeur' },
  },
  {
    path: '/confirmation-email',
    name: 'confirmation-email',
    component: () => import('../views/ConfirmationEmailPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Page d'accueil "naturelle" de chaque rôle une fois connecté — sert
// de repli quand la garde ci-dessous doit rediriger quelqu'un hors
// d'une page qui n'est pas la sienne.
const ACCUEIL_PAR_ROLE = {
  gerant: '/tableau-de-bord',
  vendeur: '/tableau-de-bord-vendeur',
  admin: '/admin/vue-ensemble',
};

router.beforeEach((to) => {
  const roleRequis = to.meta?.role;
  if (!roleRequis) return true; // route publique (accueil, connexion...) : pas de restriction.

  const session = useSession();
  const roleActuel = session.role.value;

  if (roleActuel === roleRequis) return true;

  // Connecté avec un AUTRE rôle -> renvoyé vers SA page équivalente
  // (jamais laissé sur une page qui ne lui appartient pas).
  if (roleActuel && ACCUEIL_PAR_ROLE[roleActuel]) {
    return ACCUEIL_PAR_ROLE[roleActuel];
  }

  // Pas connecté du tout -> connexion.
  return '/connexion';
});

export default router;