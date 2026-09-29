<!--
  BrandBanner.vue (molecule)
  --------------------------------------------------------------
  Rôle : bandeau de marque partagé par toutes les pages publiques
  SAUF Accueil (Connexion, Inscription entreprise, Inscription
  vendeur, Connexion admin) : logo médaillon à double anneau +
  accroche courte + bouton aide. Même logo et même texte que
  PublicPageTemplate (Accueil), pour une identité cohérente sur
  toutes les pages publiques.
-->
<template>
  <div class="brand-banner">
    <div class="brand-banner__content">
      <div class="brand-banner__identity">
        <div class="brand-banner__logo">
          <svg width="52" height="52" viewBox="0 0 58 58">
            <circle cx="29" cy="29" r="27" fill="none" stroke="#A9825C" stroke-width="1" />
            <circle cx="29" cy="29" r="22" fill="#1C2B37" />
            <circle cx="29" cy="29" r="22" fill="none" stroke="#A9825C" stroke-width="1.4" />
          </svg>
          <span class="brand-banner__logo-letter">C</span>
        </div>
        <div>
          <p class="brand-banner__nom">Comptoir</p>
          <p class="brand-banner__accroche">Votre stock, vos ventes, votre équipe — un seul comptoir pour tout piloter.</p>
        </div>
      </div>
      <button type="button" class="brand-banner__aide" aria-label="Aide" @click="$emit('help-click')">?</button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['help-click']);
</script>

<style scoped>
.brand-banner {
  background: #16212B;
}

.brand-banner__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  gap: 20px;
}

.brand-banner__identity {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-banner__logo {
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.brand-banner__logo-letter {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 27px;
  color: #C99B6E;
}

.brand-banner__nom {
  margin: 0;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 32px;
  color: #EDE7D6;
  line-height: 1;
}

.brand-banner__accroche {
  margin: 7px 0 0;
  max-width: 460px;
  color: #B7AF9C;
  font-size: 13px;
  line-height: 1.5;
  font-style: italic;
}

.brand-banner__aide {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid #3A4653;
  background: transparent;
  color: #B7AF9C;
  font-size: 13px;
  cursor: pointer;
}
</style>