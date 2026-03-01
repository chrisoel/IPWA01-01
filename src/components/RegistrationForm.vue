<script setup>
import { computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

import {
  CLOTHING_TYPES,
  CRISIS_AREAS,
  DELIVERY_METHOD_LABELS,
  DELIVERY_METHOD_OPTIONS,
  OFFICE_LOCATION_LABEL,
  REFERENCE_POSTAL_CODE,
} from '../constants/registration'
import {
  buildRegistrationPayload,
  canSelectDonationDetails as canSelectDonationDetailsByForm,
  getPostalPrefix,
  validateRegistrationForm,
} from '../features/registration/formLogic'
import { useRegistrationStore } from '../stores/registrationStore'

const router = useRouter()
const { saveRegistration } = useRegistrationStore()

const form = reactive({
  deliveryMethod: '',
  clothingType: '',
  crisisArea: '',
  pickupAddress: {
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
  },
})

const errors = reactive({})

const isPickup = computed(() => form.deliveryMethod === 'pickup')
const hasDeliveryMethod = computed(() => Boolean(form.deliveryMethod))
const referencePostalPrefix = getPostalPrefix(REFERENCE_POSTAL_CODE)
const hasPickupPostalValue = computed(() =>
  Boolean(form.pickupAddress.postalCode?.trim()),
)
const isPickupPostalAreaMismatch = computed(() => {
  if (!isPickup.value || !hasPickupPostalValue.value) {
    return false
  }

  const postalCode = form.pickupAddress.postalCode.trim()
  if (!/^\d{2}/.test(postalCode)) {
    return false
  }

  return getPostalPrefix(postalCode) !== referencePostalPrefix
})
const canSelectDonationDetails = computed(() =>
  canSelectDonationDetailsByForm(form, REFERENCE_POSTAL_CODE),
)

function setError(key, message) {
  errors[key] = message
}

function clearError(key) {
  delete errors[key]
}

function clearAllErrors() {
  for (const key of Object.keys(errors)) {
    delete errors[key]
  }
}

function clearPickupErrors() {
  clearError('pickupAddress.street')
  clearError('pickupAddress.houseNumber')
  clearError('pickupAddress.postalCode')
  clearError('pickupAddress.city')
}

function resetPickupAddress() {
  form.pickupAddress.street = ''
  form.pickupAddress.houseNumber = ''
  form.pickupAddress.postalCode = ''
  form.pickupAddress.city = ''
}

function selectDeliveryMethod(method) {
  form.deliveryMethod = method
  clearError('deliveryMethod')
}

watch(
  () => form.deliveryMethod,
  (method) => {
    clearError('deliveryMethod')

    if (method !== 'pickup') {
      resetPickupAddress()
      clearPickupErrors()
    }
  },
)

function validateForm() {
  // REQ: FA-08 Pruefung von PLZ-Format und Einzugsgebiet; QA-06 zentrale clientseitige Fehlerermittlung
  clearAllErrors()
  const result = validateRegistrationForm(form, {
    referencePostalCode: REFERENCE_POSTAL_CODE,
  })
  for (const [key, message] of Object.entries(result.errors)) {
    setError(key, message)
  }
  return result.isValid
}

function buildPayload() {
  // REQ: FA-10 Payload mit Datum, Uhrzeit und Ort erzeugen; QA-07 Ausgabegrundlage ohne Informationsverlust
  return buildRegistrationPayload(form, {
    officeLocationLabel: OFFICE_LOCATION_LABEL,
    deliveryMethodLabels: DELIVERY_METHOD_LABELS,
  })
}

function handleSubmit() {
  // REQ: FA-09 nach erfolgreicher Validierung auf die Bestaetigungsseite navigieren
  if (!validateForm()) {
    return
  }

  const payload = buildPayload()
  saveRegistration(payload)
  router.push({ name: 'confirmation' })
}
</script>

<template>
  <!-- REQ: FA-04 interaktives Registrierungsformular; FA-05 Auswahl des Uebergabewegs; FA-06/FA-07 zustandsabhaengige Formulareingaben; FA-08 Hinweis zur PLZ-Regel; QA-02 verstaendliche Formularfuehrung; QA-05 tastaturbedienbare Formularelemente; QA-06 clientseitige Validierung -->
  <section
    class="card-surface p-3 p-md-4"
    aria-labelledby="registration-form-title"
  >
    <div
      class="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4"
    >
      <div>
        <h2 id="registration-form-title" class="h4 mb-1">
          Kleiderspende registrieren
        </h2>
        <p class="form-note mb-0">
          Alle angezeigten Felder sind Pflichtfelder.
        </p>
      </div>
    </div>

    <form novalidate @submit.prevent="handleSubmit">
      <fieldset class="mb-4">
        <legend class="form-section-title mb-3">Übergabeweg wählen</legend>

        <div
          class="d-grid gap-2"
          role="group"
          aria-label="Auswahl des Übergabewegs"
        >
          <button
            v-for="option in DELIVERY_METHOD_OPTIONS"
            :key="option.value"
            type="button"
            class="delivery-method-card"
            :class="{
              'is-selected': form.deliveryMethod === option.value,
              'is-invalid': errors.deliveryMethod && form.deliveryMethod === '',
            }"
            :aria-pressed="
              form.deliveryMethod === option.value ? 'true' : 'false'
            "
            @click="selectDeliveryMethod(option.value)"
          >
            <span class="delivery-option-emoji" aria-hidden="true">{{
              option.emoji
            }}</span>
            <span>
              <span class="fw-semibold d-block">{{ option.label }}</span>
              <span class="small text-muted">{{ option.hint }}</span>
            </span>
          </button>
        </div>

        <div v-if="errors.deliveryMethod" class="invalid-feedback d-block mt-2">
          {{ errors.deliveryMethod }}
        </div>
      </fieldset>

      <div
        v-if="!hasDeliveryMethod"
        class="alert alert-info small mb-4"
        role="status"
        aria-live="polite"
      >
        Bitte wählen Sie zuerst einen Übergabeweg. Danach werden die weiteren
        Eingabefelder angezeigt.
      </div>

      <!-- REQ: FA-07 Pflichtfelder fuer Abholadresse; FA-08 sichtbare Eingabegrundlage fuer die spaetere PLZ-Pruefung -->
      <section
        v-if="isPickup"
        class="card-surface-muted p-3 p-md-4 mb-4"
        aria-labelledby="pickup-address-title"
      >
        <div
          class="d-flex flex-column flex-md-row align-items-start justify-content-between gap-2 mb-3"
        >
          <h3 id="pickup-address-title" class="h5 mb-0">Abholadresse</h3>
        </div>

        <div
          class="alert alert-warning small mb-3"
          role="status"
          aria-live="polite"
        >
          Abholung ist nur im Einzugsgebiet möglich. Die ersten zwei Ziffern der
          PLZ müssen mit der PLZ der Geschäftsstelle übereinstimmen (<strong
            >{{ referencePostalPrefix }}…</strong
          >).
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-8">
            <label for="pickupStreet" class="form-label"> Straße </label>
            <input
              id="pickupStreet"
              v-model.trim="form.pickupAddress.street"
              type="text"
              class="form-control"
              :class="{
                'is-invalid': errors['pickupAddress.street'],
                'is-pending-required':
                  !errors['pickupAddress.street'] && !form.pickupAddress.street,
              }"
              @input="clearError('pickupAddress.street')"
            />
            <div v-if="errors['pickupAddress.street']" class="invalid-feedback">
              {{ errors['pickupAddress.street'] }}
            </div>
          </div>

          <div class="col-12 col-md-4">
            <label for="pickupHouseNumber" class="form-label">
              Hausnummer
            </label>
            <input
              id="pickupHouseNumber"
              v-model.trim="form.pickupAddress.houseNumber"
              type="text"
              class="form-control"
              :class="{
                'is-invalid': errors['pickupAddress.houseNumber'],
                'is-pending-required':
                  !errors['pickupAddress.houseNumber'] &&
                  !form.pickupAddress.houseNumber,
              }"
              @input="clearError('pickupAddress.houseNumber')"
            />
            <div
              v-if="errors['pickupAddress.houseNumber']"
              class="invalid-feedback"
            >
              {{ errors['pickupAddress.houseNumber'] }}
            </div>
          </div>

          <div class="col-12 col-md-4">
            <label for="pickupPostalCode" class="form-label">
              Postleitzahl
            </label>
            <input
              id="pickupPostalCode"
              v-model.trim="form.pickupAddress.postalCode"
              type="text"
              inputmode="numeric"
              autocomplete="postal-code"
              maxlength="5"
              class="form-control"
              :class="{
                'is-invalid':
                  errors['pickupAddress.postalCode'] || isPickupPostalAreaMismatch,
                'is-pending-required':
                  !errors['pickupAddress.postalCode'] &&
                  !isPickupPostalAreaMismatch &&
                  !form.pickupAddress.postalCode,
              }"
              @input="clearError('pickupAddress.postalCode')"
            />
            <div
              v-if="errors['pickupAddress.postalCode']"
              class="invalid-feedback"
            >
              {{ errors['pickupAddress.postalCode'] }}
            </div>
          </div>

          <div class="col-12 col-md-8">
            <label for="pickupCity" class="form-label"> Ort </label>
            <input
              id="pickupCity"
              v-model.trim="form.pickupAddress.city"
              type="text"
              autocomplete="address-level2"
              class="form-control"
              :class="{
                'is-invalid': errors['pickupAddress.city'],
                'is-pending-required':
                  !errors['pickupAddress.city'] && !form.pickupAddress.city,
              }"
              @input="clearError('pickupAddress.city')"
            />
            <div v-if="errors['pickupAddress.city']" class="invalid-feedback">
              {{ errors['pickupAddress.city'] }}
            </div>
          </div>
        </div>
      </section>

      <div
        v-if="isPickup && !canSelectDonationDetails"
        class="alert alert-info small mb-4"
        role="status"
        aria-live="polite"
      >
        Bitte geben Sie zuerst die Abholadresse vollständig ein. Kleidungstyp
        und Krisengebiet werden freigeschaltet, sobald die PLZ gültig ist und
        <span :class="{ 'text-danger fw-semibold': isPickupPostalAreaMismatch }">
          die ersten zwei Ziffern mit der Geschäftsstelle übereinstimmen.
        </span>
      </div>

      <!-- REQ: FA-06 Auswahlfelder fuer Geschaeftsstelle; FA-07 dieselben Spendenangaben auch fuer Abholung nach Freischaltung -->
      <div v-if="canSelectDonationDetails" class="row g-3 mb-3">
        <div class="col-12 col-md-6">
          <label for="clothingType" class="form-label">
            <span aria-hidden="true">👕</span> Art der Kleidung
          </label>
          <select
            id="clothingType"
            v-model="form.clothingType"
            class="form-select"
            :class="{
              'is-invalid': errors.clothingType,
              'is-pending-required': !errors.clothingType && !form.clothingType,
            }"
            @change="clearError('clothingType')"
          >
            <option value="" disabled>Bitte auswählen</option>
            <option v-for="item in CLOTHING_TYPES" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
          <div v-if="errors.clothingType" class="invalid-feedback">
            {{ errors.clothingType }}
          </div>
        </div>

        <div class="col-12 col-md-6">
          <label for="crisisArea" class="form-label">
            <span aria-hidden="true">🌍</span> Krisengebiet
          </label>
          <select
            id="crisisArea"
            v-model="form.crisisArea"
            class="form-select"
            :class="{
              'is-invalid': errors.crisisArea,
              'is-pending-required': !errors.crisisArea && !form.crisisArea,
            }"
            @change="clearError('crisisArea')"
          >
            <option value="" disabled>Bitte auswählen</option>
            <option v-for="item in CRISIS_AREAS" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
          <div v-if="errors.crisisArea" class="invalid-feedback">
            {{ errors.crisisArea }}
          </div>
        </div>
      </div>

      <div
        v-if="canSelectDonationDetails"
        class="d-flex flex-column flex-sm-row gap-2 align-items-start"
      >
        <button type="submit" class="btn btn-primary btn-lg px-4">
          Registrierung abschließen
        </button>
        <p class="small text-muted mb-0 mt-2 mt-sm-0">
          Nach erfolgreicher Prüfung werden Sie auf die Bestätigungsseite
          weitergeleitet.
        </p>
      </div>
    </form>
  </section>
</template>
