  <!--
    SignalerCasseModal.vue (organism)
    --------------------------------------------------------------
    Rôle : fenêtre où le vendeur choisit un produit + une quantité
    cassée, puis "Signaler". C'est le SEUL bouton de modification du
    vendeur sur son tableau de bord — une fois signalée, la casse
    n'est plus modifiable (elle passe dans une liste en lecture seule).

    Props :
      - products : [{ nom, stockInitial ou stock }] — liste dans
        laquelle choisir le produit cassé
    Emits :
      - signaler({ produit, quantite })
      - fermer
  -->
  <template>
    <div class="signaler-casse-modal__overlay" @click.self="$emit('fermer')">
      <div class="signaler-casse-modal">
        <p class="signaler-casse-modal__titre">Signaler une casse</p>

        <div class="signaler-casse-modal__row">
          <label class="signaler-casse-modal__label" for="produit">PRODUIT</label>
          <select id="produit" class="signaler-casse-modal__input" v-model="produitChoisi">
            <option value="" disabled>-- Sélectionnez un produit --</option>
            <option v-for="p in products" :key="p.nom" :value="p.nom">{{ p.nom }}</option>
          </select>
        </div>

        <div class="signaler-casse-modal__row">
          <label class="signaler-casse-modal__label" for="quantite">QUANTITÉ CASSÉE</label>
          <input id="quantite" type="number" min="1" class="signaler-casse-modal__input" v-model.number="quantite">
        </div>

        <p v-if="messageErreur" class="signaler-casse-modal__erreur">{{ messageErreur }}</p>

        <div class="signaler-casse-modal__actions">
          <button type="button" class="signaler-casse-modal__annuler" @click="$emit('fermer')">Annuler</button>
          <button type="button" class="signaler-casse-modal__signaler" @click="valider">Signaler</button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';

  defineProps({
    products: { type: Array, required: true },
  });

  const emit = defineEmits(['signaler', 'fermer']);

  const produitChoisi = ref('');
  const quantite = ref(null);
  const messageErreur = ref('');

  function valider() {
    if (!produitChoisi.value) {
      messageErreur.value = 'Merci de choisir un produit.';
      return;
    }
    if (!quantite.value || quantite.value <= 0) {
      messageErreur.value = 'Merci de saisir une quantité valide.';
      return;
    }
    emit('signaler', { produit: produitChoisi.value, quantite: quantite.value });
  }
  </script>

  <style scoped>
  .signaler-casse-modal__overlay {
    position: fixed;
    inset: 0;
    background: rgba(22, 33, 43, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .signaler-casse-modal {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-lg) var(--space-xl);
    width: 340px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  }

  .signaler-casse-modal__titre {
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 600;
    font-size: 17px;
    color: var(--color-ink);
    margin: 0 0 var(--space-lg);
  }

  .signaler-casse-modal__row { margin-bottom: 14px; }

  .signaler-casse-modal__label {
    display: block;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--color-ink-muted);
    margin-bottom: 6px;
  }

  .signaler-casse-modal__input {
    width: 100%;
    box-sizing: border-box;
    height: 38px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-cream-light);
    padding: 0 12px;
    font-size: 14px;
    color: var(--color-ink);
  }

  .signaler-casse-modal__erreur {
    color: #b3251d;
    font-style: italic;
    font-size: 12.5px;
    margin: 0 0 var(--space-md);
  }

  .signaler-casse-modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
  }

  .signaler-casse-modal__annuler {
    height: 38px;
    padding: 0 16px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: transparent;
    color: var(--color-ink-muted);
    font-weight: 500;
    font-size: 13.5px;
    cursor: pointer;
  }

  .signaler-casse-modal__signaler {
    height: 38px;
    padding: 0 18px;
    border: none;
    border-radius: 4px;
    background: var(--color-burgundy);
    color: #F1DAD5;
    font-weight: 500;
    font-size: 13.5px;
    cursor: pointer;
  }
  </style>