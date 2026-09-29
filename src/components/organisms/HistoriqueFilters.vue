<!--
  HistoriqueFilters.vue (organism)
  --------------------------------------------------------------
  Rôle : 3 filtres select (produit, période, type de mouvement).

  Props :
    - produit, periode, type : v-model (String)
    - optionsProduit : [{ value, label }]
-->
<template>
  <div class="historique-filters">
    <select
      class="historique-filters__select"
      :value="produit"
      @change="$emit('update:produit', $event.target.value)"
    >
      <option v-for="opt in optionsProduit" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>

    <select
      class="historique-filters__select"
      :value="periode"
      @change="$emit('update:periode', $event.target.value)"
    >
      <option value="toute">Toute la période</option>
      <option value="jour">Aujourd'hui</option>
      <option value="semaine">Cette semaine</option>
      <option value="mois">Ce mois</option>
    </select>

    <select
      class="historique-filters__select"
      :value="type"
      @change="$emit('update:type', $event.target.value)"
    >
      <option value="tous">Entrées et sorties</option>
      <option value="entree">Entrées uniquement</option>
      <option value="sortie">Sorties uniquement</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  produit: { type: String, default: 'tous' },
  periode: { type: String, default: 'toute' },
  type: { type: String, default: 'tous' },
  optionsProduit: { type: Array, required: true },
});
defineEmits(['update:produit', 'update:periode', 'update:type']);
</script>

<style scoped>
.historique-filters {
  display: flex;
  gap: 10px;
  padding: 0 var(--space-xl) var(--space-lg);
}

.historique-filters__select {
  flex: 1;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink);
  font-family: var(--font-body);
}
</style>