<template>
  <!-- REQ: FA-01 sichtbarer Titel und Logo; FA-02 Header mit globaler Navigation; QA-03 einheitliche Navigation auf allen Hauptseiten -->
  <header class="brand-navbar sticky-top">
    <nav class="navbar navbar-expand-lg py-3" aria-label="Globale Navigation">
      <div class="container">
        <RouterLink class="navbar-brand d-flex align-items-center gap-3" to="/">
          <span class="logo-mark" aria-hidden="true">KP</span>
          <span class="brand-title">
            <strong>Kleiderspendenportal</strong>
            <small>Registrierung von Kleiderspenden</small>
          </span>
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Navigation umschalten"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          id="mainNav"
          class="collapse navbar-collapse justify-content-lg-end mt-3 mt-lg-0"
        >
          <ul class="navbar-nav gap-lg-2">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Registrierung</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/bestaetigung"
                >Bestätigung</RouterLink
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
