<!--
  PublicPageTemplate.vue (template)
  --------------------------------------------------------------
  Rôle : bandeau de marque (logo + accroche + aide) + bande de
  formulaire (connexion / création de compte) pour la page
  Accueil. Le logo est un médaillon à double anneau (cercle fin
  extérieur + fond légèrement plus clair à l'intérieur), plus
  présent que le simple cercle d'avant.

  Props :
    - modelValue : nom de l'entreprise saisi (v-model)
  Emits :
    - login, signup, help-click
-->
<template>
  <div class="public-template">
    <div class="public-template__header">
      <div class="public-template__brand">
        <div class="public-template__logo">
          <svg width="58" height="58" viewBox="0 0 58 58">
            <circle cx="29" cy="29" r="27" fill="none" stroke="#A9825C" stroke-width="1" />
            <circle cx="29" cy="29" r="22" fill="#1C2B37" />
            <circle cx="29" cy="29" r="22" fill="none" stroke="#A9825C" stroke-width="1.4" />
          </svg>
          <span class="public-template__logo-letter">C</span>
        </div>
        <div>
          <div class="public-template__nom">Comptoir</div>
          <p class="public-template__accroche">Votre stock, vos ventes, votre équipe — un seul comptoir pour tout piloter.</p>
        </div>
      </div>
      <button aria-label="Aide" class="public-template__aide" @click="$emit('help-click')">?</button>
    </div>

    <div class="public-template__form-band">
      <div>
        <div class="public-template__tag">CONNEXION</div>
        <div class="public-template__form-body">
          <label class="public-template__label" for="nomEntreprise">NOM DE L'ENTREPRISE</label>
          <div class="public-template__row">
            <input
              id="nomEntreprise"
              type="text"
              placeholder="ex. Atelier Nord"
              class="public-template__input"
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              @keyup.enter="$emit('login')"
            >
            <button class="public-template__btn-primary" @click="$emit('login')">Entrer</button>
          </div>
        </div>
      </div>

      <div class="public-template__nouveau">
        <p class="public-template__nouveau-label">nouveau ici</p>
        <button class="public-template__btn-outline" @click="$emit('signup')">Créer un compte</button>
      </div>
    </div>

    <div class="public-template__slot">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue', 'login', 'signup', 'help-click']);
</script>

<style scoped>
.public-template {
  background: #16212B;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'IBM Plex Sans', sans-serif;
}

.public-template__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 28px;
  gap: 20px;
}

.public-template__brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.public-template__logo {
  position: relative;
  width: 58px;
  height: 58px;
  flex-shrink: 0;
}

.public-template__logo-letter {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 30px;
  color: #C99B6E;
}

.public-template__nom {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 32px;
  font-weight: 600;
  color: #EDE7D6;
  line-height: 1;
}

.public-template__accroche {
  color: #B7AF9C;
  font-size: 13px;
  margin: 7px 0 0;
  max-width: 460px;
  line-height: 1.5;
  font-style: italic;
}

.public-template__aide {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #3A4653;
  background: transparent;
  color: #B7AF9C;
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
}

.public-template__form-band {
  background: #EDE7D6;
  padding: 22px 28px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.public-template__tag {
  display: inline-block;
  background: #2F4A3C;
  color: #DDE6DA;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border-radius: 2px 2px 0 0;
}

.public-template__form-body {
  border-top: 1px dashed #C9BFA4;
  padding-top: 18px;
}

.public-template__label {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #5B5340;
  margin-bottom: 6px;
}

.public-template__row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.public-template__input {
  width: 260px;
  box-sizing: border-box;
  height: 38px;
  border: 1px solid #C9BFA4;
  border-radius: 4px;
  background: #FBF8F1;
  padding: 0 12px;
  font-size: 14px;
  color: #2B2620;
}

.public-template__btn-primary {
  height: 38px;
  padding: 0 20px;
  border: none;
  border-radius: 4px;
  background: #A9825C;
  color: #2B2620;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.public-template__nouveau {
  text-align: right;
}

.public-template__nouveau-label {
  font-size: 11px;
  color: #8A8168;
  margin: 0 0 8px;
}

.public-template__btn-outline {
  height: 38px;
  padding: 0 18px;
  border: 1px solid #2F4A3C;
  border-radius: 4px;
  background: transparent;
  color: #2F4A3C;
  font-weight: 500;
  font-size: 13.5px;
  cursor: pointer;
}

.public-template__slot {
  padding: 0 28px 16px;
  background: #EDE7D6;
}
</style>