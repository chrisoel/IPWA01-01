<script setup>
import { computed } from 'vue'

const props = defineProps({
  pageKey: {
    type: String,
    required: true,
  },
})

const pages = {
  imprint: {
    kicker: 'Rechtliche Hinweise',
    title: 'Impressum',
    intro:
      'Statische Informationsseite gemäß den Anforderungen der Fallstudie. Die Angaben dienen als Platzhalter für die spätere Ausarbeitung.',
    sections: [
      {
        heading: 'Anbieter',
        paragraphs: [
          'Kleiderspendenportal (Fallstudien-Prototyp)',
          'Musterstraße 1, 10115 Berlin',
          'E-Mail: kontakt@kleiderspendenportal.example',
        ],
      },
      {
        heading: 'Verantwortlich für den Inhalt',
        paragraphs: [
          'Max Mustermann',
          'Hinweis: Diese Seite ist Teil eines Studienprojekts und stellt kein produktives Angebot dar.',
        ],
      },
    ],
  },
  privacy: {
    kicker: 'Rechtliche Hinweise',
    title: 'Datenschutz',
    intro:
      'Die Anwendung speichert Registrierungsdaten ausschließlich temporär im Browser (Session Storage), um die Bestätigungsseite anzuzeigen.',
    sections: [
      {
        heading: 'Verarbeitete Daten',
        paragraphs: [
          'Es werden nur die im Formular eingegebenen Daten (Kleidungstyp, Krisengebiet, ggf. Abholadresse) sowie Datum/Uhrzeit der Registrierung verarbeitet.',
          'Eine serverseitige Speicherung findet im aktuellen Prototypen nicht statt.',
        ],
      },
      {
        heading: 'Speicherdauer',
        paragraphs: [
          'Die Daten werden clientseitig in der aktuellen Browser-Sitzung gespeichert und können über die Bestätigungsseite gelöscht werden.',
        ],
      },
      {
        heading: 'Zweck',
        paragraphs: [
          'Die Verarbeitung erfolgt ausschließlich zur Darstellung der Bestätigungsseite und zur Demonstration der Formularlogik im Rahmen der Fallstudie.',
        ],
      },
    ],
  },
}

const page = computed(() => pages[props.pageKey] ?? pages.imprint)
</script>

<template>
  <!-- REQ: FA-03 statische rechtliche Hinweise als eigene Seiten; QA-03 gleiche Darstellung und Struktur wie andere Unterseiten -->
  <div class="row justify-content-center">
    <div class="col-12 col-xl-9">
      <section class="card-surface p-3 p-md-4 p-lg-5">
        <div class="page-kicker mb-2">{{ page.kicker }}</div>
        <h1 class="page-title">{{ page.title }}</h1>
        <p class="page-intro mb-4">{{ page.intro }}</p>

        <div class="legal-copy d-grid gap-4">
          <section v-for="section in page.sections" :key="section.heading">
            <h2 class="h5 mb-2">{{ section.heading }}</h2>
            <p
              v-for="paragraph in section.paragraphs"
              :key="paragraph"
              class="mb-2 text-break-anywhere"
            >
              {{ paragraph }}
            </p>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>
