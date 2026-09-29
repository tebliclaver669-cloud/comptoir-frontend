<!--
  ConnexionForm.vue (organism)
  --------------------------------------------------------------
  Rôle : formulaire de connexion simplifié — juste "Nom" et "Mot
  de passe". Plus de sélection manuelle de rôle : ConnexionPage
  détermine automatiquement si la personne est le gérant ou un
  vendeur en comparant le nom + mot de passe saisis à la base
  (nom du gérant de l'entreprise, ou nom d'un vendeur inscrit).

  Props :
    - nom : nom saisi
    - password : mot de passe saisi
-->
<template>
  <div class="connexion-form">
    <p class="connexion-form__label">CONNEXION</p>

    <div class="connexion-form__row">
      <label class="connexion-form__field-label" for="nom">NOM</label>
      <input
        id="nom"
        type="text"
        placeholder="Votre nom"
        class="connexion-form__input"
        :value="nom"
        @input="$emit('update:nom', $event.target.value)"
      >
    </div>

    <div class="connexion-form__row">
      <label class="connexion-form__field-label" for="motDePasse">MOT DE PASSE</label>
      <input
        id="motDePasse"
        type="password"
        class="connexion-form__input"
        :value="password"
        @input="$emit('update:password', $event.target.value)"
        @keyup.enter="$emit('submit')"
      >
      <button
        type="button"
        class="connexion-form__mot-de-passe-oublie"
        @click="$emit('mot-de-passe-oublie')"
      >
        Mot de passe oublié ?
      </button>
    </div>

    <button type="button" class="connexion-form__submit" @click="$emit('submit')">
      Entrer
    </button>
  </div>
</template>

<script setup>
defineProps({
  nom: { type: String, default: '' },
  password: { type: String, default: '' },
});

defineEmits(['update:nom', 'update:password', 'submit', 'mot-de-passe-oublie']);
</script>

<style scoped>
.connexion-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240px;
}

.connexion-form__label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #5B5340;
  margin: 0 0 16px;
}

.connexion-form__row {
  width: 100%;
  margin-bottom: 14px;
}

.connexion-form__field-label {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #5B5340;
  margin-bottom: 6px;
  text-align: left;
}

.connexion-form__input {
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

.connexion-form__submit {
  width: 100%;
  height: 40px;
  margin-top: 6px;
  border: none;
  border-radius: 4px;
  background: #A9825C;
  color: #2B2620;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.connexion-form__mot-de-passe-oublie {
  display: block;
  margin: 8px 0 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #5B5340;
  font-size: 11.5px;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

.connexion-form__mot-de-passe-oublie:hover {
  color: #A9825C;
}
</style>