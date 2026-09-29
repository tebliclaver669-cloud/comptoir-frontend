<!--
  AjouterVendeurForm.vue (organism)
  --------------------------------------------------------------
  Formulaire modal d'ajout d'un vendeur. Le mot de passe saisi ici
  est envoyé en clair au backend UNIQUEMENT via HTTPS/le réseau
  local de dev — c'est le serveur qui le hache (bcrypt) avant de
  l'enregistrer ; il n'est jamais stocké ni comparé côté client.
-->
<template>
  <div class="ajouter-vendeur-form__overlay" @click.self="$emit('fermer')">
    <div class="ajouter-vendeur-form">
      <h2 class="ajouter-vendeur-form__titre">Ajouter un vendeur</h2>

      <form @submit.prevent="soumettre">
        <label class="ajouter-vendeur-form__champ">
          <span>Nom et prénoms</span>
          <input v-model.trim="nomPrenoms" type="text" required />
        </label>

        <label class="ajouter-vendeur-form__champ">
          <span>Email</span>
          <input v-model.trim="email" type="email" />
        </label>

        <label class="ajouter-vendeur-form__champ">
          <span>Téléphone</span>
          <input v-model.trim="telephone" type="tel" />
        </label>

        <label class="ajouter-vendeur-form__champ">
          <span>Mot de passe</span>
          <input v-model="motDePasse" type="password" required minlength="4" />
        </label>

        <p v-if="erreur" class="ajouter-vendeur-form__erreur">{{ erreur }}</p>

        <div class="ajouter-vendeur-form__actions">
          <button type="button" class="ajouter-vendeur-form__annuler" @click="$emit('fermer')">Annuler</button>
          <button type="submit" class="ajouter-vendeur-form__valider" :disabled="enCours">
            {{ enCours ? 'Enregistrement…' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['ajouter', 'fermer']);

const nomPrenoms = ref('');
const email = ref('');
const telephone = ref('');
const motDePasse = ref('');
const erreur = ref('');
const enCours = ref(false);

async function soumettre() {
  erreur.value = '';
  enCours.value = true;
  try {
    await emit('ajouter', {
      nomPrenoms: nomPrenoms.value,
      email: email.value,
      telephone: telephone.value,
      motDePasse: motDePasse.value,
    });
  } finally {
    enCours.value = false;
  }
}

defineExpose({ erreur });
</script>

<style scoped>
.ajouter-vendeur-form__overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.ajouter-vendeur-form {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  width: 100%;
  max-width: 380px;
}

.ajouter-vendeur-form__titre {
  margin: 0 0 var(--space-md);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
}

.ajouter-vendeur-form__champ {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--space-sm);
  font-size: 12.5px;
  color: var(--color-ink-muted);
}

.ajouter-vendeur-form__champ input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  font-size: 13px;
  color: var(--color-ink);
  background: var(--color-bg-panel-muted);
}

.ajouter-vendeur-form__erreur {
  color: var(--color-red, #c0392b);
  font-size: 12.5px;
  margin: 4px 0 0;
}

.ajouter-vendeur-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.ajouter-vendeur-form__annuler {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-ink-muted);
  cursor: pointer;
}

.ajouter-vendeur-form__valider {
  background: var(--color-green);
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #DDE6DA;
  cursor: pointer;
}

.ajouter-vendeur-form__valider:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>