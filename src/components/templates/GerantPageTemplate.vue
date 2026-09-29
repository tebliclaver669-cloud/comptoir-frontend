<!--
  GerantPageTemplate.vue (template)
  --------------------------------------------------------------
  Rôle : structure commune à toutes les pages internes. Sidebar
  fixe + zone de contenu avec une pastille du nom de l'entreprise
  ET un bouton "maison" (retour accueil + déconnexion), visibles
  sur toutes les pages, y compris pour l'admin.
-->
<template>
  <div class="gerant-page-template">
    <AppSidebar :role="role" />
    <main class="gerant-page-template__content">
      <div class="gerant-page-template__entreprise-bar">
        <span v-if="role !== 'admin'" class="gerant-page-template__entreprise-pill">{{ session.nomEntreprise.value }}</span>
        <span v-else class="gerant-page-template__spacer"></span>
        <RetourAccueilButton variante="clair" />
      </div>
      <div class="gerant-page-template__inner">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../organisms/AppSidebar.vue';
import RetourAccueilButton from '../atoms/RetourAccueilButton.vue';
import { onMounted } from 'vue';
import { useSession } from '../../store/session';
import { chargerProduits } from '../../store/produits';
import { obtenirToken } from '../../services/api';

const props = defineProps({
  role: { type: String, default: 'gerant' },
});

const session = useSession();

// Après un rechargement de page (F5), les stores sont vides : on
// recharge les produits depuis le backend dès qu'une page s'ouvre,
// si on a un token et une entreprise (donc pas pour l'admin).
onMounted(() => {
  if (props.role === 'admin' || !obtenirToken() || !session.nomEntreprise.value) return;
  chargerProduits(session.nomEntreprise.value).catch(() => {});
});
</script>

<!--
  Style GLOBAL (non scoped) volontaire : html/body doivent être
  bloqués à 100% de hauteur sans leur propre défilement, sinon le
  document entier déborde et le navigateur ajoute SA propre barre de
  défilement en plus de celle de .gerant-page-template__content
  ci-dessous -> double barre collée. Ce composant est monté à la
  racine de chaque page, donc c'est l'endroit centralisé pour ce
  correctif.
-->
<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
}
</style>

<style scoped>
.gerant-page-template {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--color-bg-app);
}

.gerant-page-template__content {
  flex: 1;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: auto;
}

.gerant-page-template__entreprise-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: var(--space-sm) var(--space-xl) 0;
}

.gerant-page-template__spacer {
  flex: 1;
}

.gerant-page-template__entreprise-pill {
  display: inline-block;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--color-ink-muted);
}

.gerant-page-template__inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: var(--space-xl);
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>