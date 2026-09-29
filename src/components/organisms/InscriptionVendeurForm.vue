<!--
  InscriptionVendeurForm.vue (organism)
  --------------------------------------------------------------
  Rôle : formulaire d'inscription d'un vendeur. Les deux champs mot
  de passe (motDePasse, confirmationMotDePasse) ont chacun leur
  propre icône œil, avec un état de visibilité indépendant.

  Props :
    - modelValue : { nomPrenoms, email, telephone, motDePasse,
                      confirmationMotDePasse }
-->
<template>
  <div class="inscription-vendeur-form">
    <span class="inscription-vendeur-form__tag">INSCRIPTION VENDEUR</span>

    <div class="inscription-vendeur-form__body">
      <div class="inscription-vendeur-form__row">
        <label class="inscription-vendeur-form__label" for="nomPrenoms">NOM &amp; PRÉNOMS</label>
        <input
          id="nomPrenoms"
          type="text"
          placeholder="ex. Awa Koné"
          class="inscription-vendeur-form__input"
          :value="modelValue.nomPrenoms"
          @input="mettreAJour('nomPrenoms', $event.target.value)"
        >
      </div>

      <div class="inscription-vendeur-form__row">
        <label class="inscription-vendeur-form__label" for="email">EMAIL</label>
        <input
          id="email"
          type="email"
          placeholder="vendeur@entreprise.com"
          class="inscription-vendeur-form__input"
          :value="modelValue.email"
          @input="mettreAJour('email', $event.target.value)"
        >
      </div>

      <div class="inscription-vendeur-form__row">
        <label class="inscription-vendeur-form__label" for="telephone">NUMÉRO</label>
        <div class="inscription-vendeur-form__phone">
          <span class="inscription-vendeur-form__prefix">+225</span>
          <input
            id="telephone"
            type="tel"
            placeholder="xx-xx-xx-xx-xx"
            class="inscription-vendeur-form__input inscription-vendeur-form__input--phone"
            :value="modelValue.telephone"
            @input="mettreAJour('telephone', $event.target.value)"
          >
        </div>
      </div>

      <div class="inscription-vendeur-form__row">
        <label class="inscription-vendeur-form__label" for="motDePasse">MOT DE PASSE</label>
        <div class="inscription-vendeur-form__password-wrap">
          <input
            id="motDePasse"
            :type="isPasswordVisible ? 'text' : 'password'"
            class="inscription-vendeur-form__input inscription-vendeur-form__input--password"
            :value="modelValue.motDePasse"
            @input="mettreAJour('motDePasse', $event.target.value)"
          >
          <button
            type="button"
            class="inscription-vendeur-form__toggle-password"
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
      </div>

      <div class="inscription-vendeur-form__row">
        <label class="inscription-vendeur-form__label" for="confirmationMotDePasse">CONFIRMER MOT DE PASSE</label>
        <div class="inscription-vendeur-form__password-wrap">
          <input
            id="confirmationMotDePasse"
            :type="isConfirmationVisible ? 'text' : 'password'"
            class="inscription-vendeur-form__input inscription-vendeur-form__input--password"
            :value="modelValue.confirmationMotDePasse"
            @input="mettreAJour('confirmationMotDePasse', $event.target.value)"
          >
          <button
            type="button"
            class="inscription-vendeur-form__toggle-password"
            :aria-label="isConfirmationVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            @click="isConfirmationVisible = !isConfirmationVisible"
          >
            <svg v-if="isConfirmationVisible" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
  <circle cx="12" cy="12" r="3" />
</svg>
<svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B5340" stroke-width="2">
  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.9 18.9 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
  <line x1="1" y1="1" x2="23" y2="23" />
</svg>
          </button>
        </div>
      </div>

      <div class="inscription-vendeur-form__actions">
        <button type="button" class="inscription-vendeur-form__submit" @click="$emit('submit')">
          Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const isPasswordVisible = ref(false);
const isConfirmationVisible = ref(false);

function mettreAJour(cle, valeur) {
  emit('update:modelValue', { ...props.modelValue, [cle]: valeur });
}
</script>

<style scoped>
.inscription-vendeur-form {
  max-width: 480px;
  margin: 0 auto;
}

.inscription-vendeur-form__tag {
  display: inline-block;
  background: #2F4A3C;
  color: #DDE6DA;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  padding: 4px 11px;
  border-radius: 2px 2px 0 0;
}

.inscription-vendeur-form__body {
  border-top: 1px dashed #C9BFA4;
  padding-top: 18px;
}

.inscription-vendeur-form__row {
  margin-bottom: 14px;
}

.inscription-vendeur-form__label {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #5B5340;
  margin-bottom: 6px;
}

.inscription-vendeur-form__input {
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

.inscription-vendeur-form__phone {
  display: flex;
  gap: 8px;
}

.inscription-vendeur-form__prefix {
  flex-shrink: 0;
  width: 60px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #C9BFA4;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  color: #2B2620;
}

.inscription-vendeur-form__input--phone {
  flex: 1;
}

.inscription-vendeur-form__password-wrap {
  position: relative;
}

.inscription-vendeur-form__input--password {
  padding-right: 42px;
}

.inscription-vendeur-form__toggle-password {
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

.inscription-vendeur-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.inscription-vendeur-form__submit {
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