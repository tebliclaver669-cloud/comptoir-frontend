<!--
  ModifierFournisseurModal.vue (organism)
  --------------------------------------------------------------
  Rôle : fenêtre pour modifier ou retirer le fournisseur rattaché
  à un produit (fournisseurNom, fournisseurTel). "Supprimer" vide
  simplement ces deux champs plutôt que de les faire disparaître de
  la structure du produit.

  Props :
    - produit : { nom, fournisseurNom, fournisseurTel }
  Emits :
    - enregistrer({ fournisseurNom, fournisseurTel })
    - supprimer
    - fermer
-->
<template>
  <div class="modifier-fournisseur-modal__overlay" @click.self="$emit('fermer')">
    <div class="modifier-fournisseur-modal">
      <p class="modifier-fournisseur-modal__titre">Fournisseur de "{{ produit.nom }}"</p>

      <div class="modifier-fournisseur-modal__row">
        <label class="modifier-fournisseur-modal__label" for="fournisseurNom">NOM DU FOURNISSEUR</label>
        <input id="fournisseurNom" type="text" class="modifier-fournisseur-modal__input" v-model="valeurs.fournisseurNom">
      </div>

      <div class="modifier-fournisseur-modal__row">
        <label class="modifier-fournisseur-modal__label" for="fournisseurTel">TÉLÉPHONE</label>
        <input id="fournisseurTel" type="text" class="modifier-fournisseur-modal__input" v-model="valeurs.fournisseurTel">
      </div>

      <div class="modifier-fournisseur-modal__actions">
        <button type="button" class="modifier-fournisseur-modal__supprimer" @click="$emit('supprimer')">
          Retirer le fournisseur
        </button>
        <div class="modifier-fournisseur-modal__actions-droite">
          <button type="button" class="modifier-fournisseur-modal__annuler" @click="$emit('fermer')">Annuler</button>
          <button type="button" class="modifier-fournisseur-modal__enregistrer" @click="$emit('enregistrer', valeurs)">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  produit: { type: Object, required: true },
});

defineEmits(['enregistrer', 'supprimer', 'fermer']);

const valeurs = reactive({
  fournisseurNom: props.produit.fournisseurNom || '',
  fournisseurTel: props.produit.fournisseurTel || '',
});
</script>

<style scoped>
.modifier-fournisseur-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modifier-fournisseur-modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  width: 340px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.modifier-fournisseur-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-ink);
  margin: 0 0 var(--space-lg);
}

.modifier-fournisseur-modal__row { margin-bottom: 14px; }

.modifier-fournisseur-modal__label {
  display: block;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  margin-bottom: 6px;
}

.modifier-fournisseur-modal__input {
  width: 100%;
  box-sizing: border-box;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  padding: 0 10px;
  font-size: 13.5px;
  color: var(--color-ink);
}

.modifier-fournisseur-modal__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  gap: 8px;
}

.modifier-fournisseur-modal__actions-droite {
  display: flex;
  gap: 8px;
}

.modifier-fournisseur-modal__supprimer {
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--color-burgundy);
  border-radius: 4px;
  background: transparent;
  color: var(--color-burgundy);
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}

.modifier-fournisseur-modal__annuler {
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-ink-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.modifier-fournisseur-modal__enregistrer {
  height: 34px;
  padding: 0 14px;
  border: none;
  border-radius: 4px;
  background: var(--color-green);
  color: var(--color-text-on-dark);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
</style>