<!--
  HistoriqueTable.vue (organism)
  --------------------------------------------------------------
  Rôle : tableau des mouvements de stock. Largeurs de colonnes
  fixées via <colgroup> + table-layout: fixed. La colonne
  Utilisateur affiche une icône (Gérant/Vendeur) au-dessus du nom,
  centrés, avec un espacement constant (gap) entre les deux quelle
  que soit la ligne.

  Convention flèche :
    - Entrée -> flèche vers le BAS ↓.
    - Sortie / Casse -> flèche vers le HAUT ↑ (les deux sortent du
      stock). Le texte du badge vient de m.typeLabel (Entrée / Vente /
      Casse) — avant il était codé en dur ("Sortie"), donc une casse
      affichait à tort "↑ Sortie".

  Colonne "Reçu" (optionnelle, avecRecu: true) : bouton d'impression,
  affiché UNIQUEMENT sur les lignes de vente (m.type === 'sortie') —
  utile côté vendeur, pour réimprimer le reçu d'une vente passée si
  un client le redemande. Émet imprimer-recu(m) ; la page parente
  gère l'impression réelle (elle seule connaît le format du reçu et
  a accès aux infos de l'entreprise).

  Largeur minimale du tableau (min-width) + wrapper en scroll
  horizontal : quand la colonne qui contient ce tableau devient
  trop étroite (ex. les deux colonnes côte à côte "Mouvements" /
  "Ventes et autres" sur un écran moyen), le tableau défile
  horizontalement au lieu d'écraser ses colonnes au point que les
  en-têtes se chevauchent et que le contenu soit tronqué à
  l'excès. Les <th> ont aussi overflow/ellipsis, comme les <td> —
  avant, seuls les <td> les avaient, donc un en-tête trop long
  débordait carrément sur la colonne suivante.

  Props :
    - mouvements : [{ date, heure, produit, type: 'entree'|'sortie'|'casse',
                       typeLabel, quantite, utilisateur, total? }]
    - avecRecu : Boolean, false par défaut
  Emits :
    - imprimer-recu(m)
-->
<template>
  <div class="historique-table-wrap">
    <table class="historique-table">
      <colgroup>
        <col style="width: 13%;">
        <col :style="{ width: avecRecu ? '22%' : '26%' }">
        <col style="width: 15%;">
        <col style="width: 12%;">
        <col :style="{ width: avecRecu ? '22%' : '30%' }">
        <col v-if="avecRecu" style="width: 16%;">
      </colgroup>
      <thead>
        <tr>
          <th>Date</th>
          <th>Produit</th>
          <th class="historique-table__center">Type</th>
          <th class="historique-table__num">Quantité</th>
          <th class="historique-table__center">Utilisateur</th>
          <th v-if="avecRecu" class="historique-table__center">Reçu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(m, index) in mouvements" :key="index">
          <td>
            <div class="historique-table__date">{{ m.date }}</div>
            <div class="historique-table__heure">{{ m.heure }}</div>
          </td>
          <td class="historique-table__produit">{{ m.produit }}</td>
          <td class="historique-table__center">
            <span
              class="historique-table__type"
              :class="m.type === 'entree' ? 'historique-table__type--entree' : 'historique-table__type--sortie'"
            >
              {{ m.type === 'entree' ? '↓' : '↑' }} {{ m.typeLabel }}
            </span>
          </td>
          <td class="historique-table__num">{{ m.quantite }}</td>
          <td class="historique-table__center">
            <div class="historique-table__utilisateur">
              <span class="historique-table__utilisateur-icone" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </span>
              <span class="historique-table__utilisateur-nom">{{ m.utilisateur }}</span>
            </div>
          </td>
          <td v-if="avecRecu" class="historique-table__center">
            <button
              v-if="m.type === 'sortie'"
              type="button"
              class="historique-table__recu-btn"
              title="Réimprimer le reçu de cette vente"
              aria-label="Réimprimer le reçu de cette vente"
              @click="$emit('imprimer-recu', m)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9V2h12v7" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Reçu
            </button>
            <span v-else class="historique-table__recu-vide">—</span>
          </td>
        </tr>

        <tr v-if="mouvements.length === 0">
          <td :colspan="avecRecu ? 6 : 5" class="historique-table__vide">Aucun mouvement ne correspond à ces filtres.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  mouvements: { type: Array, required: true },
  avecRecu: { type: Boolean, default: false },
});
defineEmits(['imprimer-recu']);
</script>

<style scoped>
.historique-table-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.historique-table {
  width: 100%;
  min-width: 560px;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 13px;
}

.historique-table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  padding: 12px 16px;
  background: var(--color-bg-table-header);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.historique-table td {
  padding: 13px 16px;
  border-top: 1px solid var(--color-bg-panel-muted);
  overflow: hidden;
  text-overflow: ellipsis;
}

.historique-table__date {
  font-weight: 600;
  color: var(--color-ink);
}

.historique-table__heure {
  font-size: 11px;
  color: var(--color-ink-muted);
}

.historique-table__produit {
  font-weight: 600;
  color: var(--color-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.historique-table__center {
  text-align: center;
}

.historique-table__type {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 4px 11px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.historique-table__type--entree {
  background: var(--color-green-soft);
  color: #233F1E;
}

.historique-table__type--sortie {
  background: #EFD9CE;
  color: #8C4A32;
}

.historique-table__num {
  text-align: right;
  font-weight: 600;
}

.historique-table__utilisateur {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.historique-table__utilisateur-icone {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-bg-panel-muted);
  color: var(--color-ink-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.historique-table__utilisateur-nom {
  font-size: 12px;
  color: #5B5340;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.historique-table__recu-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg-card);
  color: var(--color-ink);
  padding: 5px 11px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.historique-table__recu-btn:hover {
  border-color: var(--color-tan);
  color: var(--color-tan);
}

.historique-table__recu-vide {
  color: var(--color-ink-muted);
}

.historique-table__vide {
  text-align: center;
  color: var(--color-ink-muted);
  font-style: italic;
  padding: var(--space-xl);
}

.historique-table th.historique-table__center {
  text-align: center;
}

.historique-table th.historique-table__num {
  text-align: right;
}
</style>