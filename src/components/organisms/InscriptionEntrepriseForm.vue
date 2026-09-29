<!--
  InscriptionEntrepriseForm.vue (organism)
  --------------------------------------------------------------
  Rôle : les 6 champs du formulaire d'inscription entreprise +
  le bouton "S'inscrire". Le champ mot de passe a une icône œil
  pour afficher/masquer la saisie (état local isPasswordVisible,
  propre à ce formulaire).
-->
<template>
  <div class="inscription-form">
    <span class="inscription-form__tag">INSCRIPTION</span>

    <div class="inscription-form__body">
      <div v-for="champ in champs" :key="champ.key" class="inscription-form__row">
        <label class="inscription-form__label" :for="champ.key">{{ champ.label }}</label>

        <div v-if="champ.type === 'password'" class="inscription-form__password-wrap">
          <input
            :id="champ.key"
            :type="isPasswordVisible ? 'text' : 'password'"
            :placeholder="champ.placeholder"
            class="inscription-form__input inscription-form__input--password"
            :value="modelValue[champ.key]"
            @input="mettreAJour(champ.key, $event.target.value)"
          >
          <button
            type="button"
            class="inscription-form__toggle-password"
            :aria-label="isPasswordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            @click="isPasswordVisible = !isPasswordVisible"
          >
            <svg v-if="isPasswordVisible" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
  <circle cx="12" cy="12" r="3" />
</svg>
<svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2">
  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.9 18.9 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
  <line x1="1" y1="1" x2="23" y2="23" />
</svg>
          </button>
        </div>

        <input
          v-else
          :id="champ.key"
          :type="champ.type || 'text'"
          :inputmode="champ.key === 'numeroEntreprise' ? 'numeric' : undefined"
          :maxlength="champ.key === 'numeroEntreprise' ? 10 : undefined"
          :placeholder="champ.placeholder"
          class="inscription-form__input"
          :value="modelValue[champ.key]"
          @input="champ.key === 'numeroEntreprise' ? gererSaisieNumero($event) : mettreAJour(champ.key, $event.target.value)"
        >
      </div>

      <div class="inscription-form__actions">
        <button
          type="button"
          class="inscription-form__submit"
          @click="$emit('submit')"
        >
          S'inscrire
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const isPasswordVisible = ref(false);

const champs = [
  { key: 'nomEntreprise', label: "NOM DE L'ENTREPRISE", placeholder: 'ex. Atelier Nord' },
  { key: 'email', label: 'ADRESSE EMAIL', type: 'email', placeholder: 'contact@entreprise.com' },
  { key: 'secteurActivite', label: "SECTEUR D'ACTIVITÉ", placeholder: 'ex. Commerce alimentaire' },
  { key: 'numeroEntreprise', label: "NUMÉRO DE L'ENTREPRISE", placeholder: 'ex. 07 00 00 00 00' },
  { key: 'nomGerant', label: 'NOM DU GÉRANT', placeholder: 'ex. Awa Koné' },
  { key: 'motDePasse', label: 'MOT DE PASSE', type: 'password', placeholder: '••••••••' },
];

function mettreAJour(cle, valeur) {
  emit('update:modelValue', { ...props.modelValue, [cle]: valeur });
}

// Le "numéro de l'entreprise" est un numéro de téléphone de contact :
// on n'accepte que des chiffres, limités à 10 (format ivoirien), en
// nettoyant directement la saisie plutôt qu'en validant après coup.
function gererSaisieNumero(event) {
  const chiffres = event.target.value.replace(/\D/g, '').slice(0, 10);
  event.target.value = chiffres;
  mettreAJour('numeroEntreprise', chiffres);
}
</script>

<style scoped>
.inscription-form {
  max-width: 480px;
  margin: 0 auto;
}

.inscription-form__tag {
  display: inline-block;
  background: #2F4A3C;
  color: #DDE6DA;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  padding: 4px 11px;
  border-radius: 2px 2px 0 0;
}

.inscription-form__body {
  border-top: 1px dashed #C9BFA4;
  padding-top: 18px;
}

.inscription-form__row {
  margin-bottom: 14px;
}

.inscription-form__label {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #5B5340;
  margin-bottom: 6px;
}

.inscription-form__input {
  width: 100%;
  box-sizing: border-box;
  height: 38px;
  border: 1px solid #C9BFA4;
  border-radius: 4px;
  background: #FBF8F1;
  padding: 0 12px;
  font-size: 14px;
  color: #2B2620;
}

.inscription-form__password-wrap {
  position: relative;
}

.inscription-form__input--password {
  padding-right: 42px;
}

.inscription-form__toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inscription-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.inscription-form__submit {
  height: 40px;
  padding: 0 26px;
  border: none;
  border-radius: 4px;
  background: #A9825C;
  color: #2B2620;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
</style>