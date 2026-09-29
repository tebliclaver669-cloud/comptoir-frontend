<!--
  QuantityInputPill.vue (atom)
  --------------------------------------------------------------
  Rôle : la pilule bleue éditable de la colonne "APPRO" : le
  gérant y saisit la quantité qu'il vient de réapprovisionner pour
  un produit. Combine un <input type="number"> stylé en pilule
  bleue + un petit bouton crayon qui donne le focus au champ (utile
  au clic sur l'icône plutôt que seulement sur le champ lui-même).

  Props :
    - modelValue : quantité saisie (Number | null)
  Emits :
    - update:modelValue
-->
<template>
  <div class="quantity-input-pill">
    <input
      ref="inputRef"
      class="quantity-input-pill__input"
      type="number"
      min="0"
      :value="modelValue ?? ''"
      @input="gererSaisie"
    />
    <button
      type="button"
      class="quantity-input-pill__edit"
      aria-label="Modifier la quantité à approvisionner"
      @click="inputRef?.focus()"
    >
      ✎
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  modelValue: { type: Number, default: null },
});
const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);

function gererSaisie(event) {
  const valeur = event.target.value;
  emit('update:modelValue', valeur === '' ? null : Number(valeur));
}
</script>

<style scoped>
.quantity-input-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: #4fa8dd;
  border-radius: 999px;
  padding: 6px 8px;
  width: 130px;
}

.quantity-input-pill__input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  text-align: center;
  font-weight: 700;
  font-style: italic;
  color: #ffffff;
  font-size: 0.9rem;
  /* Masque les flèches +/- natives du navigateur, pour rester
     fidèle au style épuré de la maquette. */
  -moz-appearance: textfield;
}

.quantity-input-pill__input::-webkit-outer-spin-button,
.quantity-input-pill__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input-pill__input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.quantity-input-pill__edit {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: #ffffff;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
