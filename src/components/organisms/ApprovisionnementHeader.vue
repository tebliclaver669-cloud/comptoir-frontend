<!--
  ApprovisionnementHeader.vue (organism)
  --------------------------------------------------------------
  Rôle : titre + badge Gérant en haut de la page Approvisionnement,
  puis une barre recherche + badge Dépenses + bouton "Ajouter produit"
  sur la même ligne (contrairement à Catalogue où les boutons sont
  au-dessus de la recherche : ici il n'y a qu'une seule action). Le
  badge Dépenses affiche le total et, cliqué, déroule le détail
  (liste des réceptions) juste en dessous — plus de panneau séparé
  en bas de page.

  Props :
    - role, nom : transmis à UserBadge
    - recherche : v-model (String)
    - totalDepenses : Number, total affiché dans le badge
    - depenses : [{ id, produit, quantite, dateMouvement, montant }]
    - chargementDepenses : Boolean
  Emits :
    - update:recherche, ajouter-click, supprimer-click
-->
<template>
  <header class="approvisionnement-header">
    <div class="approvisionnement-header__top">
      <div>
        <h1 class="approvisionnement-header__title">Approvisionnement</h1>
        <p class="approvisionnement-header__subtitle">Commandes fournisseurs et réception de stock</p>
      </div>
      <UserBadge :role="role" :nom="nom" />
    </div>

    <div class="approvisionnement-header__toolbar">
      <div class="approvisionnement-header__toolbar-left">
        <div class="approvisionnement-header__search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A8168" stroke-width="2.2">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un produit ou un fournisseur..."
            class="approvisionnement-header__input"
            :value="recherche"
            @input="$emit('update:recherche', $event.target.value)"
          >
        </div>

        <div class="approvisionnement-header__depenses-wrap">
          <button
            type="button"
            class="approvisionnement-header__depenses"
            :class="{ 'approvisionnement-header__depenses--ouvert': depensesOuvertes }"
            @click="depensesOuvertes = !depensesOuvertes"
          >
            <span class="approvisionnement-header__depenses-tag">Dépenses</span>
            <span class="approvisionnement-header__depenses-total">{{ formatCFA(totalDepenses) }}</span>
            <svg
              class="approvisionnement-header__depenses-chevron"
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div v-if="depensesOuvertes" class="approvisionnement-header__depenses-panneau">
            <p v-if="chargementDepenses" class="approvisionnement-header__depenses-vide">Chargement…</p>
            <p v-else-if="depenses.length === 0" class="approvisionnement-header__depenses-vide">
              Aucune réception de stock enregistrée pour le moment.
            </p>
            <ul v-else class="approvisionnement-header__depenses-liste">
              <li v-for="depense in depenses" :key="depense.id" class="approvisionnement-header__depense-ligne">
                <span class="approvisionnement-header__depense-date">
                  {{ formatDate(depense.dateMouvement) }} à {{ formatHeure(depense.dateMouvement) }}
                </span>
                <span class="approvisionnement-header__depense-produit">{{ depense.produit }} × {{ depense.quantite }}</span>
                <span class="approvisionnement-header__depense-valeur">{{ formatCFA(depense.montant) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="approvisionnement-header__boutons">
        <button
          v-if="nombreSelection > 0"
          type="button"
          class="approvisionnement-header__btn approvisionnement-header__btn--supprimer"
          @click="$emit('supprimer-click')"
        >
          Supprimer ({{ nombreSelection }})
        </button>

        <button type="button" class="approvisionnement-header__btn" @click="$emit('ajouter-click')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter produit
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import UserBadge from '../molecules/UserBadge.vue';
import { formatCFA } from '../../utils/format';

defineProps({
  role: { type: String, required: true },
  nom: { type: String, required: true },
  recherche: { type: String, default: '' },
  nombreSelection: { type: Number, default: 0 },
  totalDepenses: { type: Number, default: 0 },
  depenses: { type: Array, default: () => [] },
  chargementDepenses: { type: Boolean, default: false },
});
defineEmits(['update:recherche', 'ajouter-click', 'supprimer-click']);

const depensesOuvertes = ref(false);

function formatDate(dateIso) {
  return new Date(dateIso).toLocaleDateString('fr-FR');
}

function formatHeure(dateIso) {
  return new Date(dateIso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.approvisionnement-header {
  padding: var(--space-lg) var(--space-xl) 0;
}

.approvisionnement-header__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.approvisionnement-header__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  color: var(--color-ink);
  margin: 0;
}

.approvisionnement-header__subtitle {
  font-size: 12.5px;
  color: var(--color-ink-muted);
  margin: 5px 0 0;
}

.approvisionnement-header__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.approvisionnement-header__toolbar-left {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-sm);
  flex: 1;
  min-width: 0;
}

.approvisionnement-header__search {
  flex: 1;
  min-width: 200px;
  max-width: 360px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 9px 14px;
}

.approvisionnement-header__input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  width: 100%;
  color: var(--color-ink);
  font-family: var(--font-body);
}

.approvisionnement-header__depenses-wrap {
  position: relative;
}

.approvisionnement-header__depenses {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 9px 14px;
  white-space: nowrap;
  cursor: pointer;
  font-family: var(--font-body);
}

.approvisionnement-header__depenses--ouvert {
  border-color: var(--color-tan);
}

.approvisionnement-header__depenses-tag {
  display: inline-block;
  background: var(--color-green);
  color: #DDE6DA;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 2px;
}

.approvisionnement-header__depenses-total {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-ink);
}

.approvisionnement-header__depenses-chevron {
  transition: transform 0.15s ease;
}

.approvisionnement-header__depenses--ouvert .approvisionnement-header__depenses-chevron {
  transform: rotate(180deg);
}

.approvisionnement-header__depenses-panneau {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 320px;
  max-height: 300px;
  overflow-y: auto;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  z-index: 20;
}

.approvisionnement-header__depenses-vide {
  margin: 4px 0;
  font-size: 12px;
  color: var(--color-ink-muted);
  font-style: italic;
}

.approvisionnement-header__depenses-liste {
  list-style: none;
  margin: 0;
  padding: 0;
}

.approvisionnement-header__depense-ligne {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-bg-panel-muted);
  font-size: 12px;
}

.approvisionnement-header__depense-ligne:last-child {
  border-bottom: none;
}

.approvisionnement-header__depense-date {
  font-family: var(--font-mono);
  color: var(--color-ink-muted);
  font-size: 10.5px;
}

.approvisionnement-header__depense-produit {
  color: var(--color-ink);
}

.approvisionnement-header__depense-valeur {
  font-weight: 600;
  color: var(--color-ink);
}

.approvisionnement-header__boutons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.approvisionnement-header__btn--supprimer {
  background: var(--color-burgundy);
  color: #F1DAD5;
}

.approvisionnement-header__btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-green);
  color: var(--color-text-on-dark);
  padding: 10px 18px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}
</style>