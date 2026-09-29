<template>
  <div class="alert-card" :class="`alert-card--${level}`">
    <div class="alert-card__header">
      <span class="alert-card__icon-badge">
        <svg v-if="level === 'warning'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8C4A32" stroke-width="2.4"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8C3527" stroke-width="2.4"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </span>
      <p class="alert-card__title">{{ title }}</p>
    </div>
    <p class="alert-card__value">{{ message }}</p>

    <div v-if="items && items.length" class="alert-card__tooltip">
      <p class="alert-card__tooltip-titre">{{ title }}</p>
      <ul class="alert-card__tooltip-liste">
        <li v-for="(item, i) in items" :key="i">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  level: {
    type: String,
    default: 'warning',
    validator: (v) => ['warning', 'critical'].includes(v),
  },
  items: { type: Array, default: () => [] },
});
</script>

<style scoped>
.alert-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-sizing: border-box;
  height: auto;
  min-height: 100%;
}

.alert-card__tooltip {
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  z-index: 30;
  min-width: 210px;
  max-width: 280px;
  max-height: 220px;
  overflow-y: auto;
  background: var(--color-ink, #2B2620);
  color: #F5F0E4;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
  pointer-events: none;
}

.alert-card:hover .alert-card__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.alert-card__tooltip-titre {
  margin: 0 0 6px;
  font-weight: 700;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.75;
}

.alert-card__tooltip-liste {
  margin: 0;
  padding-left: 16px;
}

.alert-card__tooltip-liste li {
  margin-bottom: 3px;
  line-height: 1.35;
}

.alert-card--warning { border-left: 4px solid var(--color-terracotta); }
.alert-card--critical { border-left: 4px solid var(--color-burgundy); }

.alert-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.alert-card__icon-badge {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-card--warning .alert-card__icon-badge { background: #EFD9CE; }
.alert-card--critical .alert-card__icon-badge { background: #E9C6C0; }

.alert-card__title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
  overflow-wrap: break-word;
}

.alert-card__value {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 15px;
  overflow-wrap: break-word;
}

.alert-card--warning .alert-card__value { color: #8C4A32; }
.alert-card--critical .alert-card__value { color: var(--color-burgundy); }
</style>