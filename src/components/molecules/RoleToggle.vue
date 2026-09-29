<!--
  RoleToggle.vue (molecule)
  --------------------------------------------------------------
  Rôle : le bloc "Gérant | Vendeur" collé, où un seul des deux est
  actif à la fois. Fonctionne comme un v-model classique : le
  parent lui passe le rôle actuellement sélectionné et écoute les
  changements.

  Props :
    - modelValue : 'gerant' | 'vendeur'
  Emits :
    - update:modelValue
-->
<template>
  <div class="role-toggle">
    <SegmentButton
      label="Gérant"
      :active="modelValue === 'gerant'"
      @click="$emit('update:modelValue', 'gerant')"
    />
    <SegmentButton
      label="Vendeur"
      :active="modelValue === 'vendeur'"
      @click="$emit('update:modelValue', 'vendeur')"
    />
  </div>
</template>

<script setup>
import SegmentButton from '../atoms/SegmentButton.vue';

defineProps({
  modelValue: { type: String, required: true },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.role-toggle {
  display: inline-flex;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
</style>
