<!--
  RetourAccueilButton.vue (atom)
  --------------------------------------------------------------
  Rôle : icône "maison" réutilisée sur toutes les pages. Au clic :
  ferme la session active (déconnecte QUI QUE CE SOIT — gérant,
  vendeur, admin) puis renvoie vers l'accueil. fermerSession() est
  sans danger même si personne n'est connecté (page publique).

  Props :
    - variante : 'sombre' (icône claire, pour fond navy) | 'clair'
      (icône foncée, pour fond crème/carte) — s'adapte au fond
      derrière le bouton.
-->
<template>
  <button
    type="button"
    class="retour-accueil-btn"
    :class="`retour-accueil-btn--${variante}`"
    aria-label="Retour à l'accueil"
    @click="retourner"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { fermerSession } from '../../store/session';

defineProps({
  variante: {
    type: String,
    default: 'sombre',
    validator: (v) => ['sombre', 'clair'].includes(v),
  },
});

const router = useRouter();

function retourner() {
  fermerSession();
  router.push('/');
}
</script>

<style scoped>
.retour-accueil-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.retour-accueil-btn--sombre {
  border: 1px solid #3A4653;
  background: transparent;
  color: #B7AF9C;
}

.retour-accueil-btn--sombre:hover {
  background: rgba(169, 130, 92, 0.15);
  color: #A9825C;
}

.retour-accueil-btn--clair {
  border: 1px solid var(--color-border);
  background: var(--color-cream-light);
  color: var(--color-ink-muted);
}

.retour-accueil-btn--clair:hover {
  background: var(--color-tan);
  color: var(--color-ink);
}
</style>