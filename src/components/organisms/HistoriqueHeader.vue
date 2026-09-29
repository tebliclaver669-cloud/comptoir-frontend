<!--
  HistoriqueHeader.vue (organism)
  --------------------------------------------------------------
  Rôle : label "Traçabilité" + titre + sous-titre + badge Gérant,
  puis les 3 cartes résumé (entrées/sorties du jour, dernière
  activité).

  Props :
    - role, nom : transmis à UserBadge
    - kpis : { nbEntrees, qteEntrees, nbSorties, qteSorties,
               derniereActivite: { produit, typeLabel, date, heure, utilisateur } }
-->
<template>
  <header class="historique-header">
    <div class="historique-header__top">
      <div>
        <p class="historique-header__eyebrow">Traçabilité</p>
        <h1 class="historique-header__title">Mouvement du stock</h1>
        <p class="historique-header__subtitle">Enregistrement des ventes, entrées et sorties des produits</p>
      </div>
      <UserBadge :role="role" :nom="nom" />
    </div>

    <div class="historique-header__kpis">
      <div class="historique-header__kpi historique-header__kpi--entree">
        <p class="historique-header__kpi-label">Entrées aujourd'hui</p>
        <p class="historique-header__kpi-value">{{ kpis.nbEntrees }} mouvement{{ kpis.nbEntrees > 1 ? 's' : '' }} · {{ kpis.qteEntrees }} unités</p>
      </div>
      <div class="historique-header__kpi historique-header__kpi--sortie">
        <p class="historique-header__kpi-label">Sorties aujourd'hui</p>
        <p class="historique-header__kpi-value historique-header__kpi-value--sombre">{{ kpis.nbSorties }} mouvement{{ kpis.nbSorties > 1 ? 's' : '' }} · {{ kpis.qteSorties }} unités</p>
      </div>
      <div class="historique-header__kpi historique-header__kpi--activite">
        <p class="historique-header__kpi-label">Dernière activité</p>
        <p class="historique-header__activite-produit">{{ kpis.derniereActivite.produit }} · {{ kpis.derniereActivite.typeLabel }}</p>
        <p class="historique-header__activite-meta">
          {{ kpis.derniereActivite.date }} à {{ kpis.derniereActivite.heure }} · {{ kpis.derniereActivite.utilisateur }}
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
import UserBadge from '../molecules/UserBadge.vue';

defineProps({
  role: { type: String, required: true },
  nom: { type: String, required: true },
  kpis: { type: Object, required: true },
});
</script>

<style scoped>
.historique-header {
  padding: var(--space-lg) var(--space-xl) 0;
}

.historique-header__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.historique-header__eyebrow {
  margin: 0 0 4px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.05em;
  color: var(--color-ink-muted);
}

.historique-header__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.historique-header__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 0;
}

.historique-header__kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.historique-header__kpi {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-sizing: border-box;
}

.historique-header__kpi--entree { border-left: 4px solid var(--color-green); }
.historique-header__kpi--sortie { border-left: 4px solid var(--color-tan); }
.historique-header__kpi--activite { border-left: 4px solid var(--color-burgundy); }

.historique-header__kpi-label {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
}

.historique-header__kpi-value {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 19px;
  color: #233F1E;
}

.historique-header__kpi-value--sombre {
  color: var(--color-ink);
}

.historique-header__activite-produit {
  margin: 0;
  font-weight: 600;
  font-size: 13px;
  color: var(--color-ink);
}

.historique-header__activite-meta {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--color-ink-muted);
}
</style>