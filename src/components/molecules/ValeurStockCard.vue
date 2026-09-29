<template>
  <div class="valeur-stock-card">
    <div class="valeur-stock-card__header">
      <span class="valeur-stock-card__icon-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2F4A3C" stroke-width="2.4"><path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      </span>
      <p class="valeur-stock-card__label">{{ label }}</p>
    </div>
    <StatValue :value="value" />
  </div>
</template>

<script setup>
import StatValue from '../atoms/StatValue.vue';

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
});
</script>

<style scoped>
.valeur-stock-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-green);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-sizing: border-box;
  height: auto;
  min-height: 100%;
}

.valeur-stock-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.valeur-stock-card__icon-badge {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-green-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.valeur-stock-card__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
  overflow-wrap: break-word;
}
</style>