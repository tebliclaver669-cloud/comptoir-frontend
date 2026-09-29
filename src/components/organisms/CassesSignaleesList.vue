<!--
  CassesSignaleesList.vue (organism)
  --------------------------------------------------------------
  Rôle : liste en LECTURE SEULE des casses signalées — aucune
  action de modification, uniquement l'affichage (produit,
  quantité, date/heure, vendeur qui a signalé).

  Props :
    - casses : [{ produit, quantite, date, heure, utilisateur }]
-->
<template>
  <div class="casses-liste-wrap">
    <table class="casses-liste">
      <thead>
        <tr>
          <th>Produit</th>
          <th class="casses-liste__num">Quantité</th>
          <th>Date</th>
          <th>Signalé par</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(c, index) in casses" :key="index">
          <td class="casses-liste__produit">{{ c.produit }}</td>
          <td class="casses-liste__num">{{ c.quantite }}</td>
          <td>{{ c.date }} · {{ c.heure }}</td>
          <td>{{ c.utilisateur }}</td>
        </tr>

        <tr v-if="casses.length === 0">
          <td colspan="4" class="casses-liste__vide">Aucune casse signalée.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  casses: { type: Array, required: true },
});
</script>

<style scoped>
.casses-liste-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.casses-liste {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.casses-liste th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  padding: 10px 14px;
  background: var(--color-bg-table-header);
}

.casses-liste th.casses-liste__num { text-align: right; }

.casses-liste td {
  padding: 10px 14px;
  border-top: 1px solid var(--color-bg-panel-muted);
}

.casses-liste__num { text-align: right; }

.casses-liste__produit {
  font-weight: 600;
  color: var(--color-ink);
}

.casses-liste__vide {
  text-align: center;
  font-style: italic;
  color: var(--color-ink-muted);
  padding: var(--space-lg);
}
</style>