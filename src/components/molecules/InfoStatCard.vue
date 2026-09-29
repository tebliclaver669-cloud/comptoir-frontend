<template>
  <div class="info-stat-card">
    <div class="info-stat-card__header">
      <span class="info-stat-card__icon-badge">
        <slot name="icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8C6A2F" stroke-width="2.4"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2"/></svg>
        </slot>
      </span>
      <p class="info-stat-card__title">{{ title }}</p>
    </div>
    <p v-for="(line, i) in lines" :key="i" class="info-stat-card__line">{{ line }}</p>

    <div v-if="items && items.length" class="info-stat-card__tooltip">
      <p class="info-stat-card__tooltip-titre">{{ title }}</p>
      <ul class="info-stat-card__tooltip-liste">
        <li v-for="(item, i) in items" :key="i">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  lines: { type: Array, required: true },
  items: { type: Array, default: () => [] },
});
</script>

<style scoped>
.info-stat-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-tan);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-sizing: border-box;
  height: auto;
  min-height: 100%;
}

.info-stat-card__tooltip {
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

.info-stat-card:hover .info-stat-card__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.info-stat-card__tooltip-titre {
  margin: 0 0 6px;
  font-weight: 700;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.75;
}

.info-stat-card__tooltip-liste {
  margin: 0;
  padding-left: 16px;
}

.info-stat-card__tooltip-liste li {
  margin-bottom: 3px;
  line-height: 1.35;
}

.info-stat-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.info-stat-card__icon-badge {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #EFE0C6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-stat-card__title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
  overflow-wrap: break-word;
}

.info-stat-card__line {
  margin: 0;
  font-weight: 600;
  font-size: 13px;
  color: var(--color-ink);
  line-height: 1.4;
  overflow-wrap: break-word;
}

.info-stat-card__line:nth-child(3) {
  font-weight: 500;
  font-size: 11px;
  color: var(--color-ink-muted);
}
</style>