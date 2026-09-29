<!--
  VenteTotalRemiseCard.vue (organism)
  --------------------------------------------------------------
  Rôle : bloc gris en bas de page : Total (lecture seule) / Remise
  (lecture seule, somme des remises réellement appliquées aux ventes
  du jour, calculées côté panier au moment de chaque vente) / Restant
  (Total - Remise).

  Props :
    - total  : montant total BRUT des ventes du jour (number)
    - remise : somme des remises appliquées sur les ventes du jour (number)
-->
<template>
  <section class="vente-total-remise">
    <div class="vente-total-remise__item">
      <span class="vente-total-remise__icon-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C6A2F" stroke-width="2.4"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </span>
      <div>
        <p class="vente-total-remise__label">Total</p>
        <p class="vente-total-remise__value">{{ formatCFA(total) }}</p>
      </div>
    </div>

    <div class="vente-total-remise__divider" />

    <div class="vente-total-remise__item">
      <p class="vente-total-remise__label">Remise</p>
      <p class="vente-total-remise__value vente-total-remise__value--remise">
        {{ remise > 0 ? `− ${formatCFA(remise)}` : formatCFA(0) }}
      </p>
    </div>

    <div class="vente-total-remise__divider" />

    <div class="vente-total-remise__item">
      <p class="vente-total-remise__label">Restant</p>
      <p class="vente-total-remise__value vente-total-remise__value--accent">{{ formatCFA(restant) }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { formatCFA } from '../../utils/format';

const props = defineProps({
  total: { type: Number, required: true },
  remise: { type: Number, default: 0 },
});

const restant = computed(() => props.total - props.remise);
</script>

<style scoped>
.vente-total-remise {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.vente-total-remise__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vente-total-remise__icon-badge {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #EFE0C6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vente-total-remise__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
}

.vente-total-remise__value {
  margin: 2px 0 0;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-ink);
}

.vente-total-remise__value--remise {
  color: var(--color-burgundy);
}

.vente-total-remise__value--accent {
  color: var(--color-green);
}

.vente-total-remise__divider {
  width: 1px;
  height: 30px;
  background: var(--color-border);
}
</style>