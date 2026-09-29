<!--
  ParametresEntrepriseForm.vue (organism)
  --------------------------------------------------------------
  Rôle : liste des 5 informations de l'entreprise, chacune avec sa
  valeur actuelle bien lisible et un bouton "Modifier" qui la rend
  éditable. Les changements restent en brouillon localement ; un
  bandeau "Enregistrer les modifications" apparaît dès qu'au moins
  un champ a été changé.

  NB : plus de mot de passe demandé ici — la route backend est déjà
  protégée par le token JWT du gérant connecté (authentifier +
  exigerRole('gerant') + vérification de propriété de l'entreprise).
  Le changement de mot de passe se fait ailleurs (onglet Sécurité,
  via la route dédiée /mot-de-passe).

  Props :
    - valeurs : { nomEntreprise, email, secteurActivite,
                   numeroEntreprise, nomGerant } (valeurs actuelles,
                   depuis le backend)
  Emits :
    - enregistrer(champsModifies) : champsModifies est un objet ne
      contenant QUE les champs réellement changés
-->
<template>
  <div class="parametres-form">
    <span class="parametres-form__tag">INFORMATIONS DE L'ENTREPRISE</span>

    <div class="parametres-form__body">
      <div v-for="champ in champs" :key="champ.cle" class="parametres-form__ligne">
        <div class="parametres-form__ligne-contenu">
          <span class="parametres-form__label">{{ champ.label }}</span>

          <p v-if="champEnEdition !== champ.cle" class="parametres-form__valeur">
            {{ brouillon[champ.cle] }}
            <span v-if="estModifie(champ.cle)" class="parametres-form__pastille-modifie">modifié</span>
          </p>

          <input
            v-else
            :type="champ.type || 'text'"
            class="parametres-form__input"
            v-model="brouillon[champ.cle]"
            @keyup.enter="champEnEdition = null"
            @keyup.esc="annulerChamp(champ.cle)"
          >
        </div>

        <button
          v-if="champEnEdition !== champ.cle"
          type="button"
          class="parametres-form__modifier"
          @click="champEnEdition = champ.cle"
        >
          Modifier
        </button>
        <button
          v-else
          type="button"
          class="parametres-form__ok"
          @click="champEnEdition = null"
        >
          OK
        </button>
      </div>
    </div>

    <div v-if="champsModifies.length > 0" class="parametres-form__validation">
      <p class="parametres-form__validation-texte">
        {{ champsModifies.length }} champ{{ champsModifies.length > 1 ? 's' : '' }} modifié{{ champsModifies.length > 1 ? 's' : '' }}
      </p>
      <div class="parametres-form__validation-row">
        <button type="button" class="parametres-form__annuler" @click="annulerTout">Annuler</button>
        <button type="button" class="parametres-form__enregistrer" @click="valider">Enregistrer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';

const props = defineProps({
  valeurs: { type: Object, required: true },
});

const emit = defineEmits(['enregistrer']);

const champs = [
  { cle: 'nomEntreprise', label: "Nom de l'entreprise" },
  { cle: 'email', label: 'Adresse email', type: 'email' },
  { cle: 'secteurActivite', label: "Secteur d'activité" },
  { cle: 'numeroEntreprise', label: "Numéro de l'entreprise" },
  { cle: 'nomGerant', label: 'Nom du gérant' },
];

const brouillon = reactive({ ...props.valeurs });
const champEnEdition = ref(null);

// Si les valeurs du parent changent (après un enregistrement réussi
// qui recharge depuis le backend), le brouillon repart de zéro aligné
// dessus.
watch(
  () => props.valeurs,
  (nouvelles) => Object.assign(brouillon, nouvelles)
);

function estModifie(cle) {
  return brouillon[cle] !== props.valeurs[cle];
}

const champsModifies = computed(() => champs.map((c) => c.cle).filter(estModifie));

function annulerChamp(cle) {
  brouillon[cle] = props.valeurs[cle];
  champEnEdition.value = null;
}

function annulerTout() {
  Object.assign(brouillon, props.valeurs);
}

function valider() {
  const champsAEnvoyer = {};
  champsModifies.value.forEach((cle) => {
    champsAEnvoyer[cle] = brouillon[cle];
  });

  emit('enregistrer', champsAEnvoyer);
}
</script>

<style scoped>
.parametres-form { max-width: 460px; width: 100%; }

.parametres-form__tag {
  display: inline-block;
  background: var(--color-green);
  color: #DDE6DA;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  padding: 4px 11px;
  border-radius: 2px 2px 0 0;
}

.parametres-form__body {
  border-top: 1px dashed var(--color-border);
  padding-top: 4px;
}

.parametres-form__ligne {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-bg-panel-muted);
}

.parametres-form__ligne-contenu {
  flex: 1;
  min-width: 0;
}

.parametres-form__label {
  display: block;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--color-ink-muted);
  margin-bottom: 4px;
}

.parametres-form__valeur {
  margin: 0;
  font-size: 15px;
  color: var(--color-ink);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.parametres-form__pastille-modifie {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-tan);
  background: rgba(169, 130, 92, 0.15);
  border-radius: 999px;
  padding: 2px 8px;
}

.parametres-form__input {
  width: 100%;
  box-sizing: border-box;
  height: 36px;
  border: 1px solid var(--color-tan);
  border-radius: 4px;
  background: var(--color-cream-light);
  padding: 0 10px;
  font-size: 14px;
  color: var(--color-ink);
}

.parametres-form__modifier {
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background: var(--color-cream-light);
  color: var(--color-ink-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
}

.parametres-form__ok {
  height: 30px;
  padding: 0 14px;
  border: none;
  border-radius: 5px;
  background: var(--color-green);
  color: var(--color-text-on-dark);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
}

.parametres-form__validation {
  margin-top: var(--space-lg);
  background: rgba(169, 130, 92, 0.1);
  border: 1px solid var(--color-tan);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.parametres-form__validation-texte {
  margin: 0 0 10px;
  font-size: 12.5px;
  color: var(--color-ink);
  font-weight: 500;
}

.parametres-form__validation-row {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.parametres-form__annuler {
  height: 36px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-ink-muted);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
}

.parametres-form__enregistrer {
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 4px;
  background: var(--color-tan);
  color: var(--color-ink);
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
}
</style>