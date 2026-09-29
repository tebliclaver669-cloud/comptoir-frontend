<!--
  BeneficeCard.vue (molecule)
  --------------------------------------------------------------
  Rôle : carte KPI affichant un montant ET son pourcentage par
  rapport au chiffre d'affaires total. Réutilisée séparément pour
  Bénéfice (vert) et Perte (burgundy) — chacune avec sa propre
  couleur et son propre calcul de part, fournis par le parent.

  Props :
    - label : texte au-dessus
    - montant : number (toujours positif ici — le signe +/- est
      géré par le préfixe affiché, pas par la valeur elle-même)
    - pourcentage : number (part du montant dans le CA total)
    - variante : 'positif' | 'negatif' (couleur de la carte)
-->
<template>
  <div class="benefice-card" :class="`benefice-card--${variante}`">
    <p class="benefice-card__label">{{ label }}</p>
    <p class="benefice-card__value">{{ variante === 'positif' ? '+' : '−' }}{{ formatCFA(montant) }}</p>
    <p class="benefice-card__pourcentage">{{ pourcentage }}% du chiffre d'affaires</p>
  </div>
</template>

<script setup>
import { formatCFA } from '../../utils/format';

defineProps({
  label: { type: String, required: true },
  montant: { type: Number, required: true },
  pourcentage: { type: Number, required: true },
  variante: {
    type: String,
    default: 'positif',
    validator: (v) => ['positif', 'negatif'].includes(v),
  },
});
</script>

<style scoped>
.benefice-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-sizing: border-box;
  height: 100%;
}

.benefice-card--positif {
  background: var(--color-green-soft);
  border-left: 4px solid var(--color-green);
}

.benefice-card--negatif {
  background: #E9C6C0;
  border-left: 4px solid var(--color-burgundy);
}

.benefice-card__label {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
}

.benefice-card__value {
  margin: 0 0 4px;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 19px;
}

.benefice-card--positif .benefice-card__value { color: #233F1E; }
.benefice-card--negatif .benefice-card__value { color: #6E2116; }

.benefice-card__pourcentage {
  margin: 0;
  font-size: 11px;
  font-weight: 500;
}

.benefice-card--positif .benefice-card__pourcentage { color: #3B5D34; }
.benefice-card--negatif .benefice-card__pourcentage { color: #8C3527; }
</style>