<!--
  PanierWidget.vue (organism)
  --------------------------------------------------------------
  Rôle : icône panier avec badge (nombre d'articles), qui ouvre un
  panneau listant les produits ajoutés, avec retrait ligne par ligne,
  une remise optionnelle (sur tout le panier ou sur un seul produit)
  et la validation finale de la vente.

  Emits :
    - vente-validee(items, totalNet, remiseInfo) : au clic sur
      "Valider la vente". items porte déjà la remise répartie ligne
      par ligne ({ nom, quantite, prixUnitaire, remise }), prêt à
      envoyer au backend. La page écoute cet événement et appelle le
      backend ; c'est SEULEMENT elle qui vide le panier, une fois la
      vente confirmée par le serveur — pas ce composant. Si le
      backend refuse certains produits, le panier doit rester intact
      pour que le vendeur puisse retirer juste ceux qui posent
      problème.
-->
<template>
  <div class="panier-widget">
    <button type="button" class="panier-widget__toggle" @click="ouvert = !ouvert">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#EDE7D6" stroke-width="2.2">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span v-if="nombreArticles > 0" class="panier-widget__badge">{{ nombreArticles }}</span>
    </button>

    <div v-if="ouvert" class="panier-widget__panel">
      <p v-if="items.length === 0" class="panier-widget__vide">Aucun produit dans le panier.</p>

      <template v-else>
        <ul class="panier-widget__liste">
          <li v-for="item in items" :key="item.nom" class="panier-widget__item">
            <span class="panier-widget__item-nom">{{ item.nom }} × {{ item.quantite }}</span>
            <span class="panier-widget__item-total">{{ formatCFA(item.quantite * item.prixUnitaire) }}</span>
            <button type="button" class="panier-widget__retirer" @click="retirerDuPanier(item.nom)" aria-label="Retirer">✕</button>
          </li>
        </ul>

        <div class="panier-widget__remise">
          <button type="button" class="panier-widget__remise-toggle" @click="basculerRemise">
            {{ remiseOuverte ? 'Retirer la remise' : '+ Appliquer une remise' }}
          </button>

          <div v-if="remiseOuverte" class="panier-widget__remise-champs">
            <select class="panier-widget__remise-select" v-model="cibleRemise">
              <option value="__total__">Sur tout le panier</option>
              <option v-for="item in items" :key="item.nom" :value="item.nom">Sur « {{ item.nom }} » seulement</option>
            </select>
            <input
              type="text"
              inputmode="numeric"
              class="panier-widget__remise-input"
              placeholder="Montant en CFA"
              v-model="montantRemiseSaisi"
            >
          </div>
        </div>

        <div class="panier-widget__footer">
          <div class="panier-widget__total">
            <span>Sous-total</span>
            <span>{{ formatCFA(total) }}</span>
          </div>
          <div v-if="remiseEffective > 0" class="panier-widget__total panier-widget__total--remise">
            <span>Remise</span>
            <span>− {{ formatCFA(remiseEffective) }}</span>
          </div>
          <div class="panier-widget__total panier-widget__total--net">
            <span>Total</span>
            <span>{{ formatCFA(totalNet) }}</span>
          </div>
          <button type="button" class="panier-widget__valider" @click="validerVente">
            Valider la vente
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePanier, retirerDuPanier, definirRemise } from '../../store/panier';
import { formatCFA } from '../../utils/format';

const emit = defineEmits(['vente-validee']);

const { items, total, nombreArticles, remise, remiseEffective, totalNet, itemsAvecRemise } = usePanier();
const ouvert = ref(false);
const remiseOuverte = ref(false);

// Liés directement à l'état partagé du panier, pour que la remise
// survive tant que le panneau reste ouvert/fermé sans se perdre.
const cibleRemise = computed({
  get: () => remise.cible,
  set: (valeur) => definirRemise(valeur, remise.montant),
});
const montantRemiseSaisi = computed({
  get: () => (remise.montant ? String(remise.montant) : ''),
  set: (valeur) => definirRemise(remise.cible, valeur),
});

function basculerRemise() {
  remiseOuverte.value = !remiseOuverte.value;
  if (!remiseOuverte.value) {
    definirRemise('__total__', 0);
  }
}

function validerVente() {
  // On n'appelle plus viderPanier() ici : c'est à la page (qui sait
  // si le backend a effectivement accepté la vente) de le faire.
  emit('vente-validee', itemsAvecRemise(), totalNet.value, {
    cible: remise.cible,
    montant: remiseEffective.value,
  });
  ouvert.value = false;
  remiseOuverte.value = false;
}
</script>

<style scoped>
.panier-widget {
  position: relative;
}

.panier-widget__toggle {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: none;
  background: var(--color-green);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panier-widget__badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--color-tan);
  color: var(--color-ink);
  font-size: 10px;
  font-weight: 700;
  border-radius: 999px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panier-widget__panel {
  position: absolute;
  top: 46px;
  right: 0;
  width: 300px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

.panier-widget__vide {
  margin: 0;
  font-size: 12.5px;
  color: var(--color-ink-muted);
  font-style: italic;
  text-align: center;
  padding: var(--space-sm) 0;
}

.panier-widget__liste {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.panier-widget__item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
}

.panier-widget__item-nom {
  flex: 1;
  color: var(--color-ink);
}

.panier-widget__item-total {
  font-weight: 600;
  color: var(--color-ink);
}

.panier-widget__retirer {
  border: none;
  background: transparent;
  color: var(--color-burgundy);
  cursor: pointer;
  font-size: 12px;
}

.panier-widget__remise {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
}

.panier-widget__remise-toggle {
  border: none;
  background: transparent;
  color: var(--color-green);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.panier-widget__remise-champs {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.panier-widget__remise-select,
.panier-widget__remise-input {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-cream-light);
  padding: 6px 8px;
  font-size: 12px;
  color: var(--color-ink);
  font-family: var(--font-body);
}

.panier-widget__footer {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
}

.panier-widget__total {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  margin-bottom: 6px;
  color: var(--color-ink-muted);
}

.panier-widget__total--remise {
  color: var(--color-burgundy);
}

.panier-widget__total--net {
  font-weight: 600;
  font-size: 13.5px;
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
}

.panier-widget__valider {
  width: 100%;
  border: none;
  border-radius: 6px;
  background: var(--color-tan);
  color: var(--color-ink);
  font-weight: 600;
  font-size: 13px;
  padding: 9px;
  cursor: pointer;
}
</style>