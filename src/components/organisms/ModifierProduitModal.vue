<!--
  ModifierProduitModal.vue (organism)
  --------------------------------------------------------------
  Rôle : petite fenêtre superposée qui permet de modifier UNIQUEMENT
  le prix d'achat, le prix de vente et le seuil d'alerte d'un
  produit — rien d'autre (pas le nom, la catégorie ou le stock).

  Props :
    - produit : { nom, prixAchat, prixVente, seuilAlerte }
  Emits :
    - enregistrer({ prixAchat, prixVente, seuilAlerte })
    - fermer
-->
<template>
  <div class="modifier-produit-modal__overlay" @click.self="$emit('fermer')">
    <div class="modifier-produit-modal">
      <p class="modifier-produit-modal__titre">Modifier "{{ produit.nom }}"</p>

      <div class="modifier-produit-modal__row">
        <label class="modifier-produit-modal__label" for="prixAchat">PRIX D'ACHAT</label>
        <input
          id="prixAchat"
          type="number"
          min="0"
          class="modifier-produit-modal__input"
          v-model.number="valeurs.prixAchat"
        >
      </div>

      <div class="modifier-produit-modal__row">
        <label class="modifier-produit-modal__label" for="prixVente">PRIX DE VENTE</label>
        <input
          id="prixVente"
          type="number"
          min="0"
          class="modifier-produit-modal__input"
          v-model.number="valeurs.prixVente"
        >
      </div>

      <div class="modifier-produit-modal__row">
        <label class="modifier-produit-modal__label" for="seuilAlerte">SEUIL D'ALERTE</label>
        <input
          id="seuilAlerte"
          type="number"
          min="0"
          class="modifier-produit-modal__input"
          v-model.number="valeurs.seuilAlerte"
        >
      </div>

      <div class="modifier-produit-modal__actions">
        <button type="button" class="modifier-produit-modal__annuler" @click="$emit('fermer')">Annuler</button>
        <button type="button" class="modifier-produit-modal__enregistrer" @click="$emit('enregistrer', valeurs)">Enregistrer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  produit: { type: Object, required: true },
});

defineEmits(['enregistrer', 'fermer']);

const valeurs = reactive({
  prixAchat: props.produit.prixAchat,
  prixVente: props.produit.prixVente,
  seuilAlerte: props.produit.seuilAlerte,
});
</script>

<style scoped>
.modifier-produit-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 33, 43, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modifier-produit-modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) var(--space-xl);
  width: 320px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.modifier-produit-modal__titre {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 17px;
  color: var(--color-ink);
  margin: 0 0 var(--space-lg);
}

.modifier-produit-modal__row {
  margin-bottom: 14px;
}

.modifier-produit-modal__label {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  margin-bottom: 6px;
}

.modifier-produit-modal__input {
  width: 100%;
  box-sizing: border-box;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream-light);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-ink);
}

.modifier-produit-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modifier-produit-modal__annuler {
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-ink-muted);
  font-weight: 500;
  font-size: 13.5px;
  cursor: pointer;
}

.modifier-produit-modal__enregistrer {
  height: 38px;
  padding: 0 18px;
  border: none;
  border-radius: 4px;
  background: var(--color-tan);
  color: var(--color-ink);
  font-weight: 500;
  font-size: 13.5px;
  cursor: pointer;
}
</style>