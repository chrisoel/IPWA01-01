<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <!-- REQ: FA-03 Footer mit Impressum und Datenschutz; QA-03 konsistente globale Seitenelemente -->
  <footer class="footer-shell mt-4">
    <div class="container py-4">
      <div
        class="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3"
      >
        <div>
          <div class="fw-semibold">Kleiderspendenportal</div>
          <div class="small text-muted">
            Öffentliche Registrierung von Kleiderspenden
          </div>
        </div>

        <nav
          aria-label="Rechtliche Hinweise"
          class="d-flex flex-wrap gap-3 small"
        >
          <RouterLink to="/impressum">Impressum</RouterLink>
          <RouterLink to="/datenschutz">Datenschutz</RouterLink>
        </nav>
      </div>

      <div class="small text-muted mt-3">
        © {{ currentYear }} Kleiderspendenportal. Dieses Produkt ist eine
        Fallstudie.
      </div>
    </div>
  </footer>
</template>
