<!--
  FormField.vue (molecule)
  --------------------------------------------------------------
  Rôle : une ligne de formulaire alignée comme sur la maquette :
  le libellé aligné à droite dans une colonne fixe, le champ de
  saisie aligné à gauche à côté. Combine FieldLabel + TextField.
  Réutilisée pour "Nom de l'Entreprise", "Email", "Secteur
  d'Activité", etc., et pourra resservir sur les futurs formulaires
  (connexion, inscription vendeur...).

  Props :
    - label       : texte du libellé
    - modelValue  : v-model, valeur du champ
    - type        : type HTML du champ (transmis à TextField)
    - placeholder : optionnel, texte d'aide dans le champ
  Emits :
    - update:modelValue
-->
<template>
  <div class="form-field">
    <FieldLabel :text="label" class="form-field__label" />
    <TextField
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import FieldLabel from '../atoms/FieldLabel.vue';
import TextField from '../atoms/TextField.vue';

defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.form-field {
  display: grid;
  grid-template-columns: 220px minmax(240px, 440px);
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.form-field__label {
  text-align: right;
}

/* En dessous de 640px, on repasse le libellé au-dessus du champ
   plutôt que côte à côte, pour rester lisible sur mobile. */
@media (max-width: 640px) {
  .form-field {
    grid-template-columns: 1fr;
    gap: var(--space-xs);
  }

  .form-field__label {
    text-align: left;
  }
}
</style>
