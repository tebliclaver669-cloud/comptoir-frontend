<!--
  ModifierVendeurModal.vue (organism)
  --------------------------------------------------------------
  Modale de modification d'un vendeur. Réinitialiser le mot de passe
  est bloqué (champ désactivé + message) si le vendeur l'a déjà
  personnalisé lui-même (mot-de-passe-personnalise === true).

  Toute modification exige le mot de passe DU GÉRANT — vérifié côté
  serveur (bcrypt), jamais côté client.
-->
<template>
  <div class="modifier-vendeur-modal__overlay" @click.self="$emit('fermer')">
    <div class="modifier-vendeur-modal">
      <h2 class="modifier-vendeur-modal__titre">Modifier « {{ nomVendeur }} »</h2>

      <form @submit.prevent="soumettre">
        <label class="modifier-vendeur-modal__champ">
          <span>Nom et prénoms</span>
          <input v-model.trim="nomPrenoms" type="text" required />
        </label>

        <label class="modifier-vendeur-modal__champ">
          <span>Email</span>
          <input v-model.trim="email" type="email" />
        </label>

        <label class="modifier-vendeur-modal__champ">
          <span>Téléphone</span>
          <input v-model.trim="telephone" type="tel" />
        </label>

        <label class="modifier-vendeur-modal__champ">
          <span>Nouveau mot de passe</span>
          <input
            v-model="nouveauMotDePasse"
            type="password"
            :disabled="motDePassePersonnalise"
            :placeholder="motDePassePersonnalise ? 'Déjà personnalisé par le vendeur' : 'Laisser vide pour ne pas changer'"
          />
        </label>
        <p v-if="motDePassePersonnalise" class="modifier-vendeur-modal__note">
          Ce vendeur a déjà personnalisé son mot de passe : vous ne pouvez plus le réinitialiser depuis ici.
        </p>

        <label class="modifier-vendeur-modal__champ">
          <span>Votre mot de passe (gérant), pour confirmer</span>
          <input v-model="motDePasseGerant" type="password" required />
        </label>

        <p v-if="erreur" class="modifier-vendeur-modal__erreur">{{ erreur }}</p>

        <div class="modifier-vendeur-modal__actions">
          <button type="button" class="modifier-vendeur-modal__annuler" @click="$emit('fermer')">Annuler</button>
          <button type="submit" class="modifier-vendeur-modal__valider" :disabled="enCours">
            {{ enCours ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  nomVendeur: { type: String, required: true },
  email: { type: String, default: '' },
  telephone: { type: String, default: '' },
  motDePassePersonnalise: { type: Boolean, default: false },
});

const emit = defineEmits(['enregistrer', 'fermer']);

const nomPrenoms = ref(props.nomVendeur);
const email = ref(props.email);
const telephone = ref(props.telephone);
const nouveauMotDePasse = ref('');
const motDePasseGerant = ref('');
const erreur = ref('');
const enCours = ref(false);

async function soumettre() {
  erreur.value = '';
  enCours.value = true;
  try {
    await emit('enregistrer', {
      nomPrenoms: nomPrenoms.value,
      email: email.value,
      telephone: telephone.value,
      nouveauMotDePasse: props.motDePassePersonnalise ? undefined : (nouveauMotDePasse.value || undefined),
      motDePasseGerant: motDePasseGerant.value,
    });
  } finally {
    enCours.value = false;
  }
}

defineExpose({ erreur });
</script>

<style scoped>
.modifier-vendeur-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modifier-vendeur-modal {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  width: 100%;
  max-width: 400px;
}

.modifier-vendeur-modal__titre {
  margin: 0 0 var(--space-md);
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
  overflow-wrap: break-word;
}

.modifier-vendeur-modal__champ {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--space-sm);
  font-size: 12.5px;
  color: var(--color-ink-muted);
}

.modifier-vendeur-modal__champ input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  font-size: 13px;
  color: var(--color-ink);
  background: var(--color-bg-panel-muted);
}

.modifier-vendeur-modal__champ input:disabled {
  opacity: 0.6;
}

.modifier-vendeur-modal__note {
  margin: -4px 0 var(--space-sm);
  font-size: 11.5px;
  color: var(--color-ink-muted);
  font-style: italic;
}

.modifier-vendeur-modal__erreur {
  color: var(--color-red, #c0392b);
  font-size: 12.5px;
  margin: 4px 0 0;
}

.modifier-vendeur-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.modifier-vendeur-modal__annuler {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-ink-muted);
  cursor: pointer;
}

.modifier-vendeur-modal__valider {
  background: var(--color-green);
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #DDE6DA;
  cursor: pointer;
}

.modifier-vendeur-modal__valider:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>