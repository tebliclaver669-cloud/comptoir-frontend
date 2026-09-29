<!--
  ProductFilters.vue (organism)
  --------------------------------------------------------------
  Rôle : barre de recherche (+ 2 filtres catégorie/statut, optionnels
  via avecFiltres). La recherche a une largeur maximale (max-width)
  plutôt que de remplir tout l'espace disponible (flex: 1 seul) —
  avant, sur un écran large, elle s'étirait sur toute la largeur de
  la page.

  Props :
    - recherche, categorie, statut : v-model (String)
    - optionsCategorie, optionsStatut : [{ value, label }]
    - avecFiltres : affiche ou non les 2 <select> (par défaut oui —
      false quand une page place ces filtres ailleurs, ex. Catalogue
      Vendeur qui les met sous le panier).
-->
<template>
  <div class="product-filters">
    <div class="product-filters__search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A8168" stroke-width="2.2">
        <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Rechercher un produit..."
        class="product-filters__input"
        :value="recherche"
        @input="$emit('update:recherche', $event.target.value)"
      >
    </div>

    <template v-if="avecFiltres">
      <select
        class="product-filters__select"
        :value="categorie"
        @change="$emit('update:categorie', $event.target.value)"
      >
        <option v-for="opt in optionsCategorie" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>

      <select
        class="product-filters__select"
        :value="statut"
        @change="$emit('update:statut', $event.target.value)"
      >
        <option v-for="opt in optionsStatut" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </template>
  </div>
</template>

<script setup>
defineProps({
  recherche: { type: String, default: '' },
  categorie: { type: String, default: 'toutes' },
  statut: { type: String, default: 'tous' },
  optionsCategorie: { type: Array, default: () => [] },
  optionsStatut: { type: Array, default: () => [] },
  avecFiltres: { type: Boolean, default: true },
});
defineEmits(['update:recherche', 'update:categorie', 'update:statut']);
</script>

<style scoped>
.product-filters {
  display: flex;
  gap: 10px;
  padding: 0 var(--space-xl) var(--space-lg);
}

.product-filters__search {
  flex: 1;
  min-width: 180px;
  max-width: 320px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 9px 14px;
}

.product-filters__input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  width: 100%;
  color: var(--color-ink);
  font-family: var(--font-body);
}

.product-filters__select {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink);
  font-family: var(--font-body);
}
</style>