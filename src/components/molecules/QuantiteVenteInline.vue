<!--
  QuantiteVenteInline.vue (molecule)
  --------------------------------------------------------------
  Rôle : remplace le bouton "Vendre" d'une ligne de tableau une
  fois cliqué : champ quantité + Ajouter + Annuler.

  Props :
    - stockDisponible : number (pour borner le max saisissable)
  Emits :
    - ajouter(quantite), annuler
-->
<template>
  <div class="quantite-vente-inline">
    <input
      type="number"
      min="1"
      :max="stockDisponible"
      v-model="quantite"
      class="quantite-vente-inline__input"
      autofocus
    >
    <button type="button" class="quantite-vente-inline__ajouter" @click="$emit('ajouter', quantite)">
      Ajouter
    </button>
    <button type="button" class="quantite-vente-inline__annuler" @click="$emit('annuler')" aria-label="Annuler">
      ✕
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  stockDisponible: { type: Number, required: true },
});
defineEmits(['ajouter', 'annuler']);

const quantite = ref(1);
</script>

<style scoped>
.quantite-vente-inline {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
}

.quantite-vente-inline__input {
  width: 48px;
  height: 28px;
  text-align: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  font-size: 12px;
  font-family: var(--font-body);
}

.quantite-vente-inline__ajouter {
  background: var(--color-green);
  color: var(--color-text-on-dark);
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.quantite-vente-inline__annuler {
  width: 26px;
  height: 26px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  color: var(--color-ink-muted);
  cursor: pointer;
}
</style>