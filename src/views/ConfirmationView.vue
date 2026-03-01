<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useRegistrationStore } from '../stores/registrationStore'

const router = useRouter()
const { state, clearRegistration } = useRegistrationStore()

const registration = computed(() => state.lastRegistration)

function handleReset() {
  clearRegistration()
  router.push({ name: 'registration' })
}
</script>

<template>
  <!-- REQ: FA-09 abschliessende Bestaetigungsseite; FA-10 Anzeige aller geforderten Registrierungsdaten; QA-07 konsistente 1:1-Ausgabe der gespeicherten Werte -->
  <div v-if="!registration" class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <section class="card-surface p-4 p-md-5 text-center">
        <div class="page-kicker mb-2">Bestätigung</div>
        <h1 class="page-title mb-3">Noch keine Registrierung vorhanden</h1>
        <p class="page-intro mb-4">
          Es wurden noch keine Registrierungsdaten in dieser Sitzung
          gespeichert. Bitte starten Sie zuerst eine
          Kleiderspenden-Registrierung.
        </p>
        <RouterLink class="btn btn-primary btn-lg px-4" to="/">
          Zur Registrierungsseite
        </RouterLink>
      </section>
    </div>
  </div>

  <div v-else class="row g-4">
    <div class="col-12 col-xl-8">
      <section class="card-surface p-3 p-md-4">
        <div class="alert alert-success mb-4" role="status" aria-live="polite">
          Ihre Kleiderspende wurde erfolgreich registriert.
        </div>

        <div class="page-kicker mb-2">Bestätigung</div>
        <h1 class="page-title">Registrierung erfolgreich abgeschlossen</h1>
        <p class="page-intro mb-4">
          Nachfolgend finden Sie die vollständige Zusammenfassung der erfassten
          Daten.
        </p>

        <dl class="row g-3 confirmation-grid mb-0">
          <dt class="col-sm-4">Übergabeweg</dt>
          <dd class="col-sm-8">{{ registration.deliveryMethodLabel }}</dd>

          <dt class="col-sm-4">Art der Kleidung</dt>
          <dd class="col-sm-8">{{ registration.clothingType }}</dd>

          <dt class="col-sm-4">Krisengebiet</dt>
          <dd class="col-sm-8">{{ registration.crisisArea }}</dd>

          <dt class="col-sm-4">Datum</dt>
          <dd class="col-sm-8">{{ registration.date }}</dd>

          <dt class="col-sm-4">Uhrzeit</dt>
          <dd class="col-sm-8">{{ registration.time }}</dd>

          <dt class="col-sm-4">Ort</dt>
          <dd class="col-sm-8 text-break-anywhere">
            {{ registration.location }}
          </dd>
        </dl>
      </section>
    </div>

    <div class="col-12 col-xl-4">
      <aside class="d-grid gap-4">
        <section class="card-surface-muted p-3 p-md-4">
          <h2 class="h5 mb-3">Nächste Schritte</h2>
          <p class="small text-muted mb-3">
            Sie können eine weitere Spende registrieren oder die gespeicherten
            Sitzungsdaten löschen.
          </p>
          <div class="d-grid gap-2">
            <RouterLink class="btn btn-primary" to="/">
              Neue Registrierung
            </RouterLink>
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="handleReset"
            >
              Daten löschen und zurück
            </button>
          </div>
        </section>

        <section
          v-if="registration.pickupAddress"
          class="card-surface-muted p-3 p-md-4"
        >
          <h2 class="h5 mb-3">Abholadresse</h2>
          <p class="mb-1">
            {{ registration.pickupAddress.street }}
            {{ registration.pickupAddress.houseNumber }}
          </p>
          <p class="mb-0">
            {{ registration.pickupAddress.postalCode }}
            {{ registration.pickupAddress.city }}
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>
