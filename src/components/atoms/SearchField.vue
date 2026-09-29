<!--
  SearchField.vue (atom)
  --------------------------------------------------------------
  Rôle : champ de recherche texte ("Rechercher un produit..."),
  visuellement proche de TextField mais dans un style de fond
  légèrement grisé propre à l'espace gérant, avec icône loupe.

  Props :
    - modelValue, placeholder
  Emits :
    - update:modelValue
-->
<template>
  <div class="search-field">
    <span class="search-field__icon" aria-hidden="true">🔍</span>
    <input
      class="search-field__input"
      type="search"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.search-field {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-bg-panel-muted);
  border-radius: var(--radius-sm);
  padding: 10px 16px;
  flex: 1;
}

.search-field__icon {
  font-size: 0.9rem;
  opacity: 0.6;
}

.search-field__input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
  width: 100%;
  color: var(--color-text-main);
}

.search-field__input::placeholder {
  color: #8a8a8a;
}
</style>
