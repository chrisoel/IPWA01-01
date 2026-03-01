<script setup>
import RegistrationForm from '../components/RegistrationForm.vue'
import { OFFICE_LOCATION_LABEL } from '../constants/registration'
</script>

<template>
  <!-- REQ: FA-04 zentrale Registrierungsansicht mit Formularbereich; QA-01 responsives Grid fuer verschiedene Geraete; QA-04 Inhalte bleiben im Layout sichtbar -->
  <div class="row g-4 align-items-start">
    <div class="col-12 col-xl-7">
      <section class="card-surface p-3 p-md-4 mb-4">
        <div class="page-kicker mb-2">Registrierung</div>
        <h1 class="page-title">Kleiderspenden erfassen</h1>
        <p class="page-intro">
          Dieses Portal ermöglicht die Registrierung von Kleiderspenden für
          aktuelle Krisengebiete. Sie können zwischen persönlicher Übergabe an
          der Geschäftsstelle und Abholung wählen.
        </p>

        <div
          class="d-flex flex-wrap align-items-center gap-2 mt-4"
          aria-label="Ablauf"
        >
          <span class="summary-pill">🧭 Übergabeweg</span>
          <span class="text-muted" aria-hidden="true">➜</span>
          <span class="summary-pill">📍 Adresse (bei Abholung)</span>
          <span class="text-muted" aria-hidden="true">➜</span>
          <span class="summary-pill">👕 Spendenangaben</span>
          <span class="text-muted" aria-hidden="true">➜</span>
          <span class="summary-pill">✅ Bestätigung</span>
        </div>
      </section>

      <RegistrationForm />
    </div>

    <div class="col-12 col-xl-5">
      <aside class="d-grid gap-4">
        <section class="card-surface-muted p-3 p-md-4">
          <h2 class="h5 mb-3">Geschäftsstelle</h2>
          <p class="mb-0 small text-muted text-break-anywhere">
            {{ OFFICE_LOCATION_LABEL }}
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>
